"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-actions";
import { markAllActiveStudentsComplete, markEnrollmentCompleteAndNotify } from "@/lib/completion";
import { getCourseById } from "@/lib/courses";
import { prisma } from "@/lib/prisma";
import { adminEnrollUserSchema } from "@/lib/validations";

function revalidateEnrollmentPaths(courseId: string) {
  revalidatePath("/admin/enrollments");
  revalidatePath(`/admin/courses/${courseId}/students`);
  revalidatePath("/admin/courses");
  revalidatePath("/admin");
  revalidatePath("/my-courses");
  revalidatePath("/courses");
}

export async function confirmEnrollmentPayment(enrollmentId: string, courseId: string) {
  await requireAdmin();

  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
  });

  if (!enrollment || enrollment.courseId !== courseId) {
    return { error: "Enrollment not found." };
  }

  if (enrollment.status === "active") {
    return { error: "Already confirmed." };
  }

  if (enrollment.status === "completed") {
    return { error: "This enrollment is already completed." };
  }

  if (enrollment.status !== "pending_verification" && enrollment.status !== "pending") {
    return { error: "This enrollment cannot be confirmed." };
  }

  const course = await getCourseById(courseId);
  if (!course) {
    return { error: "Course not found." };
  }

  await prisma.enrollment.update({
    where: { id: enrollmentId },
    data: {
      status: "active",
      amountPaid: course.priceInrPaise,
      currency: "inr",
      paymentMethod: "upi",
    },
  });

  revalidateEnrollmentPaths(courseId);

  return { success: true };
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

  await prisma.enrollment.upsert({
    where: {
      userId_courseId: { userId: user.id, courseId: course.id },
    },
    create: {
      userId: user.id,
      courseId: course.id,
      status: activate ? "active" : "pending",
      amountPaid: activate ? course.priceInrPaise : null,
      currency: activate ? "inr" : null,
      paymentMethod: activate ? "upi" : null,
      upiTransactionId: utr,
      paymentReference: activate ? `ADMIN-${Date.now()}` : null,
    },
    update: {
      status: activate ? "active" : "pending",
      amountPaid: activate ? course.priceInrPaise : undefined,
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
