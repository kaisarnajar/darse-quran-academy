"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth-actions";
import { sendPaymentDeclinedEmail } from "@/lib/email";
import { AWAITING_ENROLLMENT_FEE } from "@/lib/enrollment-status";
import { getRosterEnrollmentStatusForCourse } from "@/lib/enrollments";
import {
  MONTHLY_PAYMENT_APPROVED,
  MONTHLY_PAYMENT_DECLINED,
  MONTHLY_PAYMENT_PENDING,
  PAYMENT_TYPE_ENROLLMENT,
} from "@/lib/monthly-payment-status";
import { prisma } from "@/lib/prisma";
import { getCourseById } from "@/lib/courses";
import { deleteUploadedReceipt, saveUploadedReceipt, validateReceiptPdf } from "@/lib/receipt-upload";
import { sendReceiptEmailForPayment } from "@/lib/payment-receipt-notify";

function revalidatePaymentPaths(userId: string, courseId?: string | null) {
  const paths = [
    "/admin",
    "/admin/enrollments",
    "/admin/payment-approvals",
    "/admin/students",
    `/admin/students/${userId}`,
    "/profile/payments",
    "/profile/courses",
    "/courses",
  ];
  if (courseId) {
    paths.push(`/admin/courses/${courseId}/students`);
  }
  for (const path of paths) {
    revalidatePath(path, "layout");
    revalidatePath(path, "page");
  }
}

function paymentReturnUrl(returnTo: string | undefined, event: "confirmed" | "declined"): string {
  const param = event === "confirmed" ? "confirmed" : "declined";
  const fallback = `/admin/payment-approvals?${param}=1`;
  if (!returnTo?.startsWith("/admin")) return fallback;
  const [pathname, query = ""] = returnTo.split("?");
  const params = new URLSearchParams(query);
  params.set(param, "1");
  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : `${pathname}?${param}=1`;
}

export async function confirmMonthlyPayment(
  submissionId: string,
  returnTo?: string,
): Promise<{ error?: string }> {
  await requireAdmin();

  const submission = await prisma.coursePaymentSubmission.findUnique({
    where: { id: submissionId },
    include: { user: { select: { email: true, name: true } } },
  });

  if (!submission) {
    return { error: "Payment submission not found." };
  }

  if (submission.status === MONTHLY_PAYMENT_APPROVED) {
    redirect(paymentReturnUrl(returnTo, "confirmed"));
  }

  if (submission.status !== MONTHLY_PAYMENT_PENDING) {
    return { error: "This payment cannot be confirmed." };
  }

  if (submission.paymentType === PAYMENT_TYPE_ENROLLMENT) {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId: submission.userId, courseId: submission.courseId },
      },
    });

    if (!enrollment || enrollment.status !== AWAITING_ENROLLMENT_FEE) {
      return { error: "Enrollment is not awaiting an enrollment fee payment." };
    }
  }

  const record = await prisma.paymentRecord.create({
    data: {
      userId: submission.userId,
      courseId: submission.courseId,
      amountInrPaise: submission.amountInrPaise,
      paidAt: new Date(),
      description: submission.label,
    },
  });

  await prisma.coursePaymentSubmission.update({
    where: { id: submissionId },
    data: {
      status: MONTHLY_PAYMENT_APPROVED,
      paymentRecordId: record.id,
    },
  });

  if (submission.paymentType === PAYMENT_TYPE_ENROLLMENT) {
    const course = await getCourseById(submission.courseId);
    if (!course) {
      return { error: "Course not found." };
    }

    await prisma.enrollment.updateMany({
      where: {
        userId: submission.userId,
        courseId: submission.courseId,
        status: AWAITING_ENROLLMENT_FEE,
      },
      data: { status: getRosterEnrollmentStatusForCourse(course.status) },
    });
  }

  revalidatePaymentPaths(submission.userId, submission.courseId);
  redirect(paymentReturnUrl(returnTo, "confirmed"));
}

export async function declineMonthlyPayment(
  submissionId: string,
  returnTo?: string,
): Promise<{ error?: string }> {
  await requireAdmin();

  const submission = await prisma.coursePaymentSubmission.findUnique({
    where: { id: submissionId },
    include: { user: { select: { email: true, name: true } } },
  });

  if (!submission) {
    return { error: "Payment submission not found." };
  }

  if (submission.status !== MONTHLY_PAYMENT_PENDING) {
    return { error: "Only pending payments can be declined." };
  }

  const course = await getCourseById(submission.courseId);
  if (!course) {
    return { error: "Course not found." };
  }

  await prisma.coursePaymentSubmission.update({
    where: { id: submissionId },
    data: {
      status: MONTHLY_PAYMENT_DECLINED,
      upiTransactionId: null,
      paymentScreenshotPath: null,
      paymentMethod: null,
    },
  });

  const base = process.env.AUTH_URL || "http://localhost:3000";
  const paymentUrl =
    submission.paymentType === PAYMENT_TYPE_ENROLLMENT
      ? `${base.replace(/\/$/, "")}/profile/courses/${submission.courseId}/enrollment-pay`
      : `${base.replace(/\/$/, "")}/profile/courses/${submission.courseId}/pay`;

  await sendPaymentDeclinedEmail({
    to: submission.user.email,
    studentName: submission.user.name ?? "",
    courseTitle: course.title,
    paymentUrl,
  });

  revalidatePaymentPaths(submission.userId, submission.courseId);
  redirect(paymentReturnUrl(returnTo, "declined"));
}

export async function sendGeneratedReceipt(paymentRecordId: string) {
  await requireAdmin();

  const record = await prisma.paymentRecord.findUnique({ where: { id: paymentRecordId } });
  if (!record) {
    return { error: "Payment record not found." };
  }

  const result = await sendReceiptEmailForPayment(paymentRecordId, {
    useGeneratedReceipt: true,
  });
  if (result.error) {
    return { error: result.error };
  }

  revalidatePaymentPaths(record.userId, record.courseId);
  return { success: true };
}

export async function uploadAndSendReceipt(paymentRecordId: string, formData: FormData) {
  await requireAdmin();

  const record = await prisma.paymentRecord.findUnique({ where: { id: paymentRecordId } });
  if (!record) {
    return { error: "Payment record not found." };
  }

  const file = formData.get("receipt");
  const validation = validateReceiptPdf(file instanceof File ? file : null);
  if (validation.error) {
    return { error: validation.error };
  }

  if (record.uploadedReceiptPath) {
    await deleteUploadedReceipt(record.uploadedReceiptPath);
  }

  const uploadedPath = await saveUploadedReceipt(paymentRecordId, file as File);

  await prisma.paymentRecord.update({
    where: { id: paymentRecordId },
    data: { uploadedReceiptPath: uploadedPath },
  });

  const result = await sendReceiptEmailForPayment(paymentRecordId);
  if (result.error) {
    return { error: result.error };
  }

  revalidatePaymentPaths(record.userId, record.courseId);
  return { success: true };
}
