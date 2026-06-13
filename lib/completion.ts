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
