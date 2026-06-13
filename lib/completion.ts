import type { CourseStatus } from "@prisma/client";
import { getRosterEnrollmentStatusForCourse } from "@/lib/enrollments";
import { prisma } from "@/lib/prisma";

/** Keep roster enrollments aligned with course status from Edit Course. */
export async function syncEnrollmentsWithCourseStatus(
  courseId: string,
  courseStatus: CourseStatus,
): Promise<void> {
  const rosterStatus = getRosterEnrollmentStatusForCourse(courseStatus);

  if (rosterStatus === "completed") {
    await prisma.enrollment.updateMany({
      where: { courseId, status: "active" },
      data: { status: "completed", completedAt: new Date() },
    });
    return;
  }

  await prisma.enrollment.updateMany({
    where: { courseId, status: "completed" },
    data: { status: "active", completedAt: null },
  });
}
