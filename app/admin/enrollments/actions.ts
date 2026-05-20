"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth-actions";
import {
  deleteUploadedCertificate,
  saveUploadedCertificate,
  validateCertificatePdf,
} from "@/lib/certificate-upload";
import {
  markAllActiveStudentsComplete,
  markEnrollmentComplete,
  sendCertificateEmailForEnrollment,
} from "@/lib/completion";
import { getCourseById } from "@/lib/courses";
import {
  AWAITING_PAYMENT_VERIFICATION,
  canApproveEnrollment,
  PAYMENT_DECLINED,
  PENDING_ENROLLMENT_APPROVAL,
} from "@/lib/enrollment-status";
import { sendPaymentDeclinedEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import {
  lookupStudentAccountForEnrollment,
  normalizeStudentEmail,
} from "@/lib/student-admin";
import { adminEnrollUserSchema } from "@/lib/validations";

function revalidateEnrollmentPaths(courseId: string) {
  const paths = [
    "/admin",
    "/admin/enrollments",
    "/admin/students",
    "/admin/courses",
    `/admin/courses/${courseId}/students`,
    "/profile/courses",
    "/my-courses",
    "/courses",
  ];

  for (const path of paths) {
    revalidatePath(path, "layout");
    revalidatePath(path, "page");
  }
}

function enrollmentReturnUrl(returnTo: string | undefined, event: "approved" | "declined"): string {
  const param = event === "approved" ? "approved" : "declined";
  const fallback = `/admin/enrollments?${param}=1`;
  if (!returnTo?.startsWith("/admin")) return fallback;
  const [pathname, query = ""] = returnTo.split("?");
  const params = new URLSearchParams(query);
  params.set(param, "1");
  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : `${pathname}?${param}=1`;
}

/** Approve a student's enrollment request (free registration). */
export async function approveEnrollmentRequest(
  enrollmentId: string,
  courseId: string,
  returnTo?: string,
): Promise<{ error?: string }> {
  await requireAdmin();

  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
  });

  if (!enrollment || enrollment.courseId !== courseId) {
    return { error: "Enrollment not found." };
  }

  if (enrollment.status === "active") {
    redirect(enrollmentReturnUrl(returnTo, "approved"));
  }

  if (enrollment.status === "completed") {
    return { error: "This enrollment is already completed." };
  }

  if (!canApproveEnrollment(enrollment.status)) {
    return { error: "This enrollment cannot be approved." };
  }

  const course = await getCourseById(courseId);
  if (!course) {
    return { error: "Course not found." };
  }

  await prisma.enrollment.update({
    where: { id: enrollmentId },
    data: {
      status: "active",
      amountPaid: null,
      currency: null,
      paymentMethod: null,
      upiTransactionId: null,
      paymentScreenshotPath: null,
    },
  });

  revalidateEnrollmentPaths(courseId);
  revalidatePath(`/admin/students/${enrollment.userId}`, "page");

  redirect(enrollmentReturnUrl(returnTo, "approved"));
}

/** @deprecated Legacy registration payment decline */
export async function declineEnrollmentPayment(
  enrollmentId: string,
  courseId: string,
  returnTo?: string,
): Promise<{ error?: string }> {
  await requireAdmin();

  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: { user: { select: { email: true, name: true } } },
  });

  if (!enrollment || enrollment.courseId !== courseId) {
    return { error: "Enrollment not found." };
  }

  if (enrollment.status !== AWAITING_PAYMENT_VERIFICATION) {
    return { error: "Only legacy payment submissions can be declined here." };
  }

  const course = await getCourseById(courseId);
  if (!course) return { error: "Course not found." };

  await prisma.enrollment.update({
    where: { id: enrollmentId },
    data: {
      status: PAYMENT_DECLINED,
      upiTransactionId: null,
      paymentScreenshotPath: null,
      paymentMethod: null,
      amountPaid: null,
      currency: null,
    },
  });

  const base = process.env.AUTH_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
  await sendPaymentDeclinedEmail({
    to: enrollment.user.email,
    studentName: enrollment.user.name ?? "",
    courseTitle: course.title,
    paymentUrl: `${base.replace(/\/$/, "")}/profile/courses`,
  });

  revalidateEnrollmentPaths(courseId);
  redirect(enrollmentReturnUrl(returnTo, "declined"));
}

/** @deprecated Use approveEnrollmentRequest */
export async function confirmEnrollmentPayment(
  enrollmentId: string,
  courseId: string,
  returnTo?: string,
) {
  return approveEnrollmentRequest(enrollmentId, courseId, returnTo);
}

export type AdminEnrollUserState = {
  error?: string;
  success?: string;
};

export async function adminEnrollUser(
  _prev: AdminEnrollUserState,
  formData: FormData,
): Promise<AdminEnrollUserState> {
  await requireAdmin();

  const parsed = adminEnrollUserSchema.safeParse({
    email: formData.get("email"),
    courseId: formData.get("courseId"),
    approveImmediately: formData.get("approveImmediately") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid form data." };
  }

  const account = await lookupStudentAccountForEnrollment(parsed.data.email);
  if (!account.ok) {
    return { error: account.error };
  }

  const course = await getCourseById(parsed.data.courseId);
  if (!course) {
    return { error: "Course not found." };
  }

  const status = parsed.data.approveImmediately ? "active" : PENDING_ENROLLMENT_APPROVAL;

  await prisma.enrollment.upsert({
    where: {
      userId_courseId: { userId: account.userId, courseId: course.id },
    },
    create: {
      userId: account.userId,
      courseId: course.id,
      status,
    },
    update: {
      status,
      amountPaid: null,
      currency: null,
      paymentMethod: null,
      upiTransactionId: null,
      paymentScreenshotPath: null,
      paymentReference: null,
    },
  });

  revalidateEnrollmentPaths(course.id);

  return {
    success:
      status === "active"
        ? `${account.name} is now enrolled in ${course.title}.`
        : `${account.name} was added to ${course.title}. Approve the request to grant course access.`,
  };
}

export async function previewStudentAccountForEnrollment(email: string) {
  await requireAdmin();
  if (!email.trim()) {
    return { ok: false as const, error: "Enter an email address." };
  }
  return lookupStudentAccountForEnrollment(normalizeStudentEmail(email));
}

export async function completeEnrollment(enrollmentId: string, courseId: string) {
  await requireAdmin();

  const enrollment = await prisma.enrollment.findUnique({ where: { id: enrollmentId } });
  if (!enrollment || enrollment.courseId !== courseId) {
    return { error: "Enrollment not found." };
  }

  const result = await markEnrollmentComplete(enrollmentId);
  if (result.error) {
    return { error: result.error };
  }

  revalidateEnrollmentPaths(courseId);
  return { success: true };
}

export async function sendGeneratedCertificate(enrollmentId: string, courseId: string) {
  await requireAdmin();

  const enrollment = await prisma.enrollment.findUnique({ where: { id: enrollmentId } });
  if (!enrollment || enrollment.courseId !== courseId) {
    return { error: "Enrollment not found." };
  }

  const result = await sendCertificateEmailForEnrollment(enrollmentId, {
    useGeneratedCertificate: true,
  });
  if (result.error) {
    return { error: result.error };
  }

  revalidateEnrollmentPaths(courseId);
  return { success: true };
}

export async function uploadAndSendCertificate(
  enrollmentId: string,
  courseId: string,
  formData: FormData,
) {
  await requireAdmin();

  const enrollment = await prisma.enrollment.findUnique({ where: { id: enrollmentId } });
  if (!enrollment || enrollment.courseId !== courseId) {
    return { error: "Enrollment not found." };
  }

  const file = formData.get("certificate");
  const validation = validateCertificatePdf(file instanceof File ? file : null);
  if (validation.error) {
    return { error: validation.error };
  }

  if (enrollment.uploadedCertificatePath) {
    await deleteUploadedCertificate(enrollment.uploadedCertificatePath);
  }

  const uploadedPath = await saveUploadedCertificate(enrollmentId, file as File);

  await prisma.enrollment.update({
    where: { id: enrollmentId },
    data: { uploadedCertificatePath: uploadedPath },
  });

  const result = await sendCertificateEmailForEnrollment(enrollmentId);
  if (result.error) {
    return { error: result.error };
  }

  revalidateEnrollmentPaths(courseId);
  return { success: true };
}

export async function removeEnrollmentFromCourse(enrollmentId: string, courseId: string) {
  await requireAdmin();

  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
  });

  if (!enrollment || enrollment.courseId !== courseId) {
    return { error: "Enrollment not found." };
  }

  await deleteUploadedCertificate(enrollment.uploadedCertificatePath);
  await prisma.enrollment.delete({ where: { id: enrollmentId } });

  revalidateEnrollmentPaths(courseId);
  revalidatePath(`/admin/students/${enrollment.userId}`);

  return { success: true };
}

export async function completeAllActiveStudents(courseId: string) {
  await requireAdmin();

  const course = await getCourseById(courseId);
  if (!course) {
    return { error: "Course not found." };
  }

  const { completed, errors } = await markAllActiveStudentsComplete(courseId);

  revalidateEnrollmentPaths(courseId);

  if (completed === 0 && errors.length > 0) {
    return { error: errors[0] ?? "No active students to complete." };
  }

  return { success: true, completed, errors };
}
