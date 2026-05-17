import { sendCertificateEmail } from "@/lib/email";
import { formatCertificateId, getCertificateDownloadUrl } from "@/lib/certificate";
import { getCourseById } from "@/lib/courses";
import { prisma } from "@/lib/prisma";

export async function markEnrollmentCompleteAndNotify(enrollmentId: string): Promise<{ error?: string }> {
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: { user: { select: { name: true, email: true } } },
  });

  if (!enrollment) {
    return { error: "Enrollment not found." };
  }

  if (enrollment.status !== "active" && enrollment.status !== "completed") {
    return { error: "Only active enrollments can be marked complete." };
  }

  const course = await getCourseById(enrollment.courseId);
  if (!course) {
    return { error: "Course not found." };
  }

  const completedAt = enrollment.completedAt ?? new Date();

  await prisma.enrollment.update({
    where: { id: enrollmentId },
    data: {
      status: "completed",
      completedAt,
    },
  });

  if (!enrollment.certificateEmailSentAt) {
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
  }

  return {};
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
    const result = await markEnrollmentCompleteAndNotify(id);
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

export { formatCertificateId };
