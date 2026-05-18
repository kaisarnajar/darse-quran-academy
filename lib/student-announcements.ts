import { prisma } from "@/lib/prisma";

export async function getStudentCourseForAnnouncements(userId: string, courseId: string) {
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  if (!enrollment) return null;

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: {
      id: true,
      title: true,
      teacher: { select: { name: true } },
    },
  });
  if (!course) return null;

  return { enrollment, course };
}
