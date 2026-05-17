import { prisma } from "@/lib/prisma";

export async function getEnrolledCourseIds(userId: string): Promise<string[]> {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId, status: "active" },
    select: { courseId: true },
  });
  return enrollments.map((e) => e.courseId);
}

export async function getUserEnrollments(userId: string) {
  return prisma.enrollment.findMany({
    where: { userId, status: "active" },
    orderBy: { createdAt: "desc" },
  });
}

export async function isUserEnrolled(userId: string, courseId: string): Promise<boolean> {
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: { userId, courseId },
    },
  });
  return enrollment?.status === "active";
}
