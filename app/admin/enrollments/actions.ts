"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth-actions";
import { markAllActiveStudentsComplete, markEnrollmentCompleteAndNotify } from "@/lib/completion";
import { getRegistrationFeePaise } from "@/lib/course-pricing";
import { getCourseById } from "@/lib/courses";
import { sendPaymentDeclinedEmail } from "@/lib/email";
import { AWAITING_PAYMENT_VERIFICATION, PAYMENT_DECLINED } from "@/lib/enrollment-status";
import { prisma } from "@/lib/prisma";
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

function getPaymentPageUrl(enrollmentId: string): string {
  const base = process.env.AUTH_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
  return `${base.replace(/\/$/, "")}/payment/${enrollmentId}`;
}

function adminPaymentReturnUrl(
  returnTo: string | undefined,
  courseId: string,
  event: "confirmed" | "declined",
): string {
  const param = event === "confirmed" ? "confirmed" : "declined";
  const fallback = `/admin/enrollments?${param}=1`;

  if (!returnTo?.startsWith("/admin")) {
    return fallback;
  }

  const [pathname, query = ""] = returnTo.split("?");
  const params = new URLSearchParams(query);
  params.set(param, "1");
  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : `${pathname}?${param}=1`;
}

export async function confirmEnrollmentPayment(
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
    redirect(adminPaymentReturnUrl(returnTo, courseId, "confirmed"));
  }

  if (enrollment.status === "completed") {
    return { error: "This enrollment is already completed." };
  }

  if (
    enrollment.status !== AWAITING_PAYMENT_VERIFICATION &&
    enrollment.status !== "pending"
  ) {
    return { error: "This enrollment cannot be confirmed." };
  }

  const course = await getCourseById(courseId);
  if (!course) {
    return { error: "Course not found." };
  }

  const updated = await prisma.enrollment.update({
    where: { id: enrollmentId },
    data: {
      status: "active",
      amountPaid: getRegistrationFeePaise(course.level),
      currency: "inr",
      paymentMethod: enrollment.paymentMethod ?? "upi",
    },
  });

  if (updated.status !== "active") {
    return { error: "Payment could not be confirmed. Please try again." };
  }

  revalidateEnrollmentPaths(courseId);
  revalidatePath(`/admin/students/${enrollment.userId}`, "page");

  redirect(adminPaymentReturnUrl(returnTo, courseId, "confirmed"));
}

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
    return { error: "Only submitted payments awaiting verification can be declined." };
  }

  const course = await getCourseById(courseId);
  if (!course) {
    return { error: "Course not found." };
  }

  const updated = await prisma.enrollment.update({
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

  if (updated.status !== PAYMENT_DECLINED) {
    return { error: "Payment could not be declined. Please try again." };
  }

  const paymentUrl = getPaymentPageUrl(enrollmentId);
  await sendPaymentDeclinedEmail({
    to: enrollment.user.email,
    studentName: enrollment.user.name ?? "",
    courseTitle: course.title,
    paymentUrl,
  });

  revalidateEnrollmentPaths(courseId);
  revalidatePath(`/admin/students/${enrollment.userId}`, "page");
  revalidatePath("/profile/courses", "page");

  redirect(adminPaymentReturnUrl(returnTo, courseId, "declined"));
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
    upiTransactionId: formData.get("upiTransactionId") || undefined,
    markAsPaid: formData.get("markAsPaid") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid form data." };
  }

  const email = parsed.data.email.toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return {
      error: "No account found for this email. Ask the student to register first, then enroll them.",
    };
  }

  const course = await getCourseById(parsed.data.courseId);
  if (!course) {
    return { error: "Course not found." };
  }

  const utr = parsed.data.upiTransactionId?.trim() || null;
  const activate = parsed.data.markAsPaid || Boolean(utr);
  const registrationFeePaise = getRegistrationFeePaise(course.level);

  await prisma.enrollment.upsert({
    where: {
      userId_courseId: { userId: user.id, courseId: course.id },
    },
    create: {
      userId: user.id,
      courseId: course.id,
      status: activate ? "active" : "pending",
      amountPaid: activate ? registrationFeePaise : null,
      currency: activate ? "inr" : null,
      paymentMethod: activate ? "upi" : null,
      upiTransactionId: utr,
      paymentReference: activate ? `ADMIN-${Date.now()}` : null,
    },
    update: {
      status: activate ? "active" : "pending",
      amountPaid: activate ? registrationFeePaise : undefined,
      currency: activate ? "inr" : undefined,
      paymentMethod: activate ? "upi" : undefined,
      upiTransactionId: utr ?? undefined,
      ...(activate ? { paymentReference: `ADMIN-${Date.now()}` } : {}),
    },
  });

  revalidateEnrollmentPaths(course.id);

  return {
    success: activate
      ? `${user.name ?? email} is now enrolled in ${course.title}.`
      : `${user.name ?? email} was added to ${course.title} with payment pending.`,
  };
}

export async function completeEnrollmentAndSendCertificate(
  enrollmentId: string,
  courseId: string,
) {
  await requireAdmin();

  const enrollment = await prisma.enrollment.findUnique({ where: { id: enrollmentId } });
  if (!enrollment || enrollment.courseId !== courseId) {
    return { error: "Enrollment not found." };
  }

  const result = await markEnrollmentCompleteAndNotify(enrollmentId);
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
