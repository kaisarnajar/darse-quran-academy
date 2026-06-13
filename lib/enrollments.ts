import { unstable_noStore as noStore } from "next/cache";
import type { CourseStatus } from "@prisma/client";
import {
  AWAITING_ENROLLMENT_FEE,
  PENDING_ENROLLMENT_APPROVAL,
} from "@/lib/enrollment-status";
import { prisma } from "@/lib/prisma";

export type CourseEnrollmentWithUser = {
  id: string;
  status: string;
  completedAt: Date | null;
  uploadedCertificatePath: string | null;
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

export async function getUserEnrollments(userId: string) {
  return prisma.enrollment.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export function enrollmentStatusLabel(status: string) {
  if (status === PENDING_ENROLLMENT_APPROVAL) return "Awaiting approval";
  if (status === AWAITING_ENROLLMENT_FEE) return "Awaiting enrollment fee";
  if (status === "completed") return "Completed";
  if (status === "active") return "Active";
  return status.replace(/_/g, " ");
}

export function enrollmentStatusClass(status: string) {
  if (status === "completed") return "bg-emerald-100 text-emerald-900";
  if (status === "active") return "bg-violet-100 text-violet-800";
  if (status === PENDING_ENROLLMENT_APPROVAL) return "bg-amber-100 text-amber-900";
  if (status === AWAITING_ENROLLMENT_FEE) return "bg-amber-100 text-amber-900";
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

/** Active roster for in-progress courses; completed roster when the course is completed. */
export function getRosterEnrollmentStatusForCourse(courseStatus: CourseStatus): "active" | "completed" {
  return courseStatus === "COMPLETED" ? "completed" : "active";
}

export async function getCourseRosterEnrollments(
  courseId: string,
  courseStatus: CourseStatus,
): Promise<CourseEnrollmentWithUser[]> {
  noStore();
  return prisma.enrollment.findMany({
    where: {
      courseId,
      status: getRosterEnrollmentStatusForCourse(courseStatus),
    },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });
}

export async function getEnrollmentCountsByCourse(): Promise<Map<string, number>> {
  noStore();
  const courses = await prisma.course.findMany({
    select: { id: true, status: true },
  });

  const [activeCounts, completedCounts] = await Promise.all([
    prisma.enrollment.groupBy({
      by: ["courseId"],
      where: { status: "active" },
      _count: { _all: true },
    }),
    prisma.enrollment.groupBy({
      by: ["courseId"],
      where: { status: "completed" },
      _count: { _all: true },
    }),
  ]);

  const activeByCourse = new Map(activeCounts.map((row) => [row.courseId, row._count._all]));
  const completedByCourse = new Map(completedCounts.map((row) => [row.courseId, row._count._all]));

  return new Map(
    courses.map((course) => [
      course.id,
      getRosterEnrollmentStatusForCourse(course.status) === "completed"
        ? (completedByCourse.get(course.id) ?? 0)
        : (activeByCourse.get(course.id) ?? 0),
    ]),
  );
}

export type PendingEnrollmentWithUser = CourseEnrollmentWithUser & {
  courseId: string;
};

export async function getPendingFreeEnrollmentApprovals(): Promise<PendingEnrollmentWithUser[]> {
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

export async function getAwaitingEnrollmentFeeEnrollments(): Promise<PendingEnrollmentWithUser[]> {
  noStore();
  return prisma.enrollment.findMany({
    where: { status: AWAITING_ENROLLMENT_FEE },
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

export async function getAwaitingEnrollmentFeeCount(): Promise<number> {
  noStore();
  return prisma.enrollment.count({
    where: { status: AWAITING_ENROLLMENT_FEE },
  });
}

