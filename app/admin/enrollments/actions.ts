"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-actions";
import { markAllActiveStudentsComplete, markEnrollmentCompleteAndNotify } from "@/lib/completion";
import { getCourseById } from "@/lib/courses";
import { prisma } from "@/lib/prisma";

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
    },
  });

  revalidatePath(`/admin/courses/${courseId}/students`);
  revalidatePath("/admin");
  revalidatePath("/my-courses");

  return { success: true };
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

  revalidatePath(`/admin/courses/${courseId}/students`);
  revalidatePath("/my-courses");

  return { success: true };
}

export async function completeAllActiveStudents(courseId: string) {
  await requireAdmin();

  const course = await getCourseById(courseId);
  if (!course) {
    return { error: "Course not found." };
  }

  const { completed, errors } = await markAllActiveStudentsComplete(courseId);

  revalidatePath(`/admin/courses/${courseId}/students`);
  revalidatePath("/my-courses");

  if (completed === 0 && errors.length > 0) {
    return { error: errors[0] ?? "No active students to complete." };
  }

  return { success: true, completed, errors };
}
