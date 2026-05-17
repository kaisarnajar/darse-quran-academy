import { prisma } from "@/lib/prisma";

export type CourseEnrollmentWithUser = {
  id: string;
  status: string;
  amountPaid: number | null;
  currency: string | null;
  upiTransactionId: string | null;
  paymentReference: string | null;
  completedAt: Date | null;
  certificateEmailSentAt: Date | null;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
};

export async function getUserCourseEnrollmentMap(userId: string) {
  const rows = await prisma.enrollment.findMany({ where: { userId } });
  return new Map(rows.map((row) => [row.courseId, row]));
}

export async function getEnrolledCourseIds(userId: string): Promise<string[]> {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId, status: { in: ["active", "completed"] } },
    select: { courseId: true },
  });
  return enrollments.map((e) => e.courseId);
}

export async function getUserEnrollments(userId: string) {
  return prisma.enrollment.findMany({
    where: { userId },
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

export async function getEnrollmentsForCourse(courseId: string): Promise<CourseEnrollmentWithUser[]> {
  return prisma.enrollment.findMany({
    where: { courseId },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });
}

export async function getEnrollmentCountForCourse(courseId: string): Promise<number> {
  return prisma.enrollment.count({ where: { courseId } });
}

export async function getEnrollmentCountsByCourse(): Promise<Map<string, number>> {
  const rows = await prisma.enrollment.groupBy({
    by: ["courseId"],
    _count: { _all: true },
  });
  return new Map(rows.map((row) => [row.courseId, row._count._all]));
}
