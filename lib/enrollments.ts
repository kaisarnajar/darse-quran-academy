import { unstable_noStore as noStore } from "next/cache";
import {
  AWAITING_PAYMENT_VERIFICATION,
  NEEDS_PAYMENT_SUBMISSION,
  PAYMENT_DECLINED,
  PENDING_ENROLLMENT_APPROVAL,
} from "@/lib/enrollment-status";
import { prisma } from "@/lib/prisma";

export type CourseEnrollmentWithUser = {
  id: string;
  status: string;
  amountPaid: number | null;
  currency: string | null;
  upiTransactionId: string | null;
  paymentMethod: string | null;
  paymentScreenshotPath: string | null;
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

export function getCourseEnrollmentReminder(status: string | null | undefined): string | null {
  if (!status) return null;
  switch (status) {
    case "active":
      return "You are already enrolled in this course.";
    case "completed":
      return "You have already completed this course.";
    case PENDING_ENROLLMENT_APPROVAL:
      return "Your enrollment request is awaiting approval by the academy.";
    case "pending_verification":
      return "Your enrollment is awaiting verification by the academy.";
    case "payment_declined":
      return "Your previous payment was not verified. Please contact the academy.";
    case "pending":
      return "Your enrollment is awaiting approval.";
    default:
      return "You already have an enrollment request for this course.";
  }
}

export function hasCourseEnrollment(status: string | null | undefined): boolean {
  return Boolean(status);
}

export function enrollmentStatusLabel(status: string) {
  if (status === PENDING_ENROLLMENT_APPROVAL) return "Awaiting approval";
  if (status === "pending_verification") return "Awaiting verification";
  if (status === "payment_declined") return "Payment declined";
  if (status === "completed") return "Completed";
  if (status === "active") return "Active";
  if (status === "pending") return "Awaiting approval";
  return status.replace(/_/g, " ");
}

export function enrollmentStatusClass(status: string) {
  if (status === "completed") return "bg-emerald-100 text-emerald-900";
  if (status === "active") return "bg-violet-100 text-violet-800";
  if (status === PENDING_ENROLLMENT_APPROVAL) return "bg-amber-100 text-amber-900";
  if (status === "pending_verification") return "bg-amber-100 text-amber-900";
  if (status === "payment_declined") return "bg-red-100 text-red-900";
  if (status === "pending") return "bg-amber-100 text-amber-900";
  return "bg-stone-200 text-stone-700";
}

export async function getEnrollmentsForCourse(courseId: string): Promise<CourseEnrollmentWithUser[]> {
  noStore();
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

export async function getPendingEnrollmentApprovals(): Promise<PendingEnrollmentWithUser[]> {
  noStore();
  return prisma.enrollment.findMany({
    where: { status: PENDING_ENROLLMENT_APPROVAL },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });
}

export async function getPendingEnrollmentApprovalCount(): Promise<number> {
  noStore();
  return prisma.enrollment.count({
    where: { status: PENDING_ENROLLMENT_APPROVAL },
  });
}

/** @deprecated Use getPendingMonthlyPayments for fee approvals */
export async function getPendingPaymentEnrollments(): Promise<PendingEnrollmentWithUser[]> {
  noStore();
  return prisma.enrollment.findMany({
    where: { status: AWAITING_PAYMENT_VERIFICATION },
    orderBy: { updatedAt: "desc" },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });
}

/** @deprecated */
export async function getPendingPaymentCount(): Promise<number> {
  noStore();
  return prisma.enrollment.count({
    where: { status: AWAITING_PAYMENT_VERIFICATION },
  });
}

export {
  AWAITING_PAYMENT_VERIFICATION,
  NEEDS_PAYMENT_SUBMISSION,
  PAYMENT_DECLINED,
  PENDING_ENROLLMENT_APPROVAL,
};
