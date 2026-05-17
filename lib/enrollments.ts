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
  updatedAt: Date;
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
  return enrollment?.status === "active" || enrollment?.status === "completed";
}

/** User-facing copy when they already have an enrollment row for this course */
export function getCourseEnrollmentReminder(status: string | null | undefined): string | null {
  if (!status) return null;
  switch (status) {
    case "active":
      return "You are already enrolled in this course.";
    case "completed":
      return "You have already completed this course.";
    case "pending_verification":
      return "You are already enrolled. Your payment is awaiting verification by the academy.";
    case "pending":
      return "You already started enrolling in this course. Complete your UPI payment below.";
    default:
      return "You are already enrolled in this course.";
  }
}

export function hasCourseEnrollment(status: string | null | undefined): boolean {
  return Boolean(status);
}

export function enrollmentStatusLabel(status: string) {
  if (status === "pending_verification") return "Awaiting verification";
  if (status === "completed") return "Completed";
  if (status === "active") return "Active";
  if (status === "pending") return "Payment pending";
  return status.replace(/_/g, " ");
}

export function enrollmentStatusClass(status: string) {
  if (status === "completed") return "bg-emerald-100 text-emerald-900";
  if (status === "active") return "bg-violet-100 text-violet-800";
  if (status === "pending_verification") return "bg-amber-100 text-amber-900";
  if (status === "pending") return "bg-stone-200 text-stone-700";
  return "bg-stone-200 text-stone-700";
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

export type PendingEnrollmentWithUser = CourseEnrollmentWithUser & {
  courseId: string;
};

export async function getPendingPaymentEnrollments(): Promise<PendingEnrollmentWithUser[]> {
  return prisma.enrollment.findMany({
    where: { status: { in: ["pending_verification", "pending"] } },
    orderBy: { updatedAt: "desc" },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });
}

export async function getPendingPaymentCount(): Promise<number> {
  return prisma.enrollment.count({
    where: { status: { in: ["pending_verification", "pending"] } },
  });
}
