import { sendCertificateEmail } from "@/lib/email";
import { deleteUploadedCertificate } from "@/lib/certificate-upload";
import { getCertificateDownloadUrl } from "@/lib/certificate";
import { getCourseById } from "@/lib/courses";
import { prisma } from "@/lib/prisma";

export async function markEnrollmentComplete(enrollmentId: string): Promise<{ error?: string }> {
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
  });

  if (!enrollment) {
    return { error: "Enrollment not found." };
  }

  if (enrollment.status !== "active") {
    return { error: "Only active enrollments can be marked complete." };
  }

  await prisma.enrollment.update({
    where: { id: enrollmentId },
    data: {
      status: "completed",
      completedAt: enrollment.completedAt ?? new Date(),
    },
  });

  return {};
}

export async function sendCertificateEmailForEnrollment(
  enrollmentId: string,
  options?: { useGeneratedCertificate?: boolean },
): Promise<{ error?: string }> {
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: { user: { select: { name: true, email: true } } },
  });

  if (!enrollment) {
    return { error: "Enrollment not found." };
  }

  if (!isEnrollmentCertificateReady(enrollment)) {
    return { error: "Mark the student as complete before sending a certificate." };
  }

  const course = await getCourseById(enrollment.courseId);
  if (!course) {
    return { error: "Course not found." };
  }

  if (options?.useGeneratedCertificate && enrollment.uploadedCertificatePath) {
    await deleteUploadedCertificate(enrollment.uploadedCertificatePath);
    await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: { uploadedCertificatePath: null },
    });
  }

  const certificateUrl = getCertificateDownloadUrl(enrollmentId);
  await sendCertificateEmail({
    to: enrollment.user.email,
    studentName: enrollment.user.name ?? "",
    courseTitle: course.title,
    certificateUrl,
  });

  await prisma.enrollment.update({
    where: { id: enrollmentId },
    data: { certificateEmailSentAt: new Date() },
  });

  return {};
}

/** @deprecated Use markEnrollmentComplete — completion no longer sends email automatically. */
export async function markEnrollmentCompleteAndNotify(enrollmentId: string): Promise<{ error?: string }> {
  const result = await markEnrollmentComplete(enrollmentId);
  if (result.error) return result;
  return sendCertificateEmailForEnrollment(enrollmentId, { useGeneratedCertificate: true });
}

export async function markAllActiveStudentsComplete(courseId: string): Promise<{
  completed: number;
  errors: string[];
}> {
  const activeEnrollments = await prisma.enrollment.findMany({
    where: { courseId, status: "active" },
    select: { id: true },
  });

  let completed = 0;
  const errors: string[] = [];

  for (const { id } of activeEnrollments) {
    const result = await markEnrollmentComplete(id);
    if (result.error) {
      errors.push(result.error);
    } else {
      completed += 1;
    }
  }

  return { completed, errors };
}

export function isEnrollmentCertificateReady(enrollment: {
  status: string;
  completedAt: Date | null;
}): boolean {
  return enrollment.status === "completed" && enrollment.completedAt != null;
}

export function getCertificateFilename(courseTitle: string, enrollmentId: string): string {
  const slug = courseTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  return `certificate-${slug || "course"}-${enrollmentId.slice(0, 8)}.pdf`;
}

export { formatCertificateId } from "@/lib/certificate";
