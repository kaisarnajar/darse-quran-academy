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
import { getRegistrationFeePaise } from "@/lib/course-pricing";
import { getCourseById } from "@/lib/courses";
import {
  AWAITING_ENROLLMENT_FEE,
  canApproveEnrollment,
  canRejectEnrollment,
  PENDING_ENROLLMENT_APPROVAL,
} from "@/lib/enrollment-status";
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
    "/courses",
  ];

  for (const path of paths) {
    revalidatePath(path, "layout");
    revalidatePath(path, "page");
  }
}

function enrollmentReturnUrl(
  returnTo: string | undefined,
  event: "approved" | "declined" | "rejected",
): string {
  const param =
    event === "approved" ? "approved" : event === "rejected" ? "rejected" : "declined";
  const fallback = `/admin/enrollments?${param}=1`;
  if (!returnTo?.startsWith("/admin")) return fallback;
  const [pathname, query = ""] = returnTo.split("?");
  const params = new URLSearchParams(query);
  params.set(param, "1");
  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : `${pathname}?${param}=1`;
}

/** Approve a free-course enrollment request. */
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
    data: { status: "active" },
  });

  revalidateEnrollmentPaths(courseId);
  revalidatePath(`/admin/students/${enrollment.userId}`, "page");

  redirect(enrollmentReturnUrl(returnTo, "approved"));
}

/** Reject a student's pending enrollment request. */
export async function rejectEnrollmentRequest(
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

  if (!canRejectEnrollment(enrollment.status)) {
    return { error: "Only pending enrollment requests can be rejected." };
  }

  await prisma.enrollment.delete({ where: { id: enrollmentId } });

  revalidateEnrollmentPaths(courseId);
  revalidatePath(`/admin/students/${enrollment.userId}`, "page");

  redirect(enrollmentReturnUrl(returnTo, "rejected"));
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

  let status: string;
  if (parsed.data.approveImmediately) {
    status = "active";
  } else if (getRegistrationFeePaise(course) > 0) {
    status = AWAITING_ENROLLMENT_FEE;
  } else {
    status = PENDING_ENROLLMENT_APPROVAL;
  }

  await prisma.enrollment.upsert({
    where: {
      userId_courseId: { userId: account.userId, courseId: course.id },
    },
    create: {
      userId: account.userId,
      courseId: course.id,
      status,
    },
    update: { status },
  });

  revalidateEnrollmentPaths(course.id);

  if (status === "active") {
    return { success: `${account.name} is now enrolled in ${course.title}.` };
  }
  if (status === AWAITING_ENROLLMENT_FEE) {
    return {
      success: `${account.name} was added to ${course.title}. They must pay the enrollment fee before access is granted.`,
    };
  }
  return {
    success: `${account.name} was added to ${course.title}. Approve the request to grant course access.`,
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
