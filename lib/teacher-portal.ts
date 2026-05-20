import type { Course, CourseStatus, Teacher } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getEnrollmentsForCourse } from "@/lib/enrollments";

export type TeacherCourse = Course & {
  studentCount: number;
};

export async function getCoursesForTeacher(teacherId: string): Promise<TeacherCourse[]> {
  const courses = await prisma.course.findMany({
    where: { teacherId },
    orderBy: { createdAt: "desc" },
  });

  const counts = await prisma.enrollment.groupBy({
    by: ["courseId"],
    where: { courseId: { in: courses.map((c) => c.id) } },
    _count: { _all: true },
  });
  const countByCourse = new Map(counts.map((row) => [row.courseId, row._count._all]));

  return courses.map((course) => ({
    ...course,
    studentCount: countByCourse.get(course.id) ?? 0,
  }));
}

export async function getTeacherCourseForPortal(teacherId: string, courseId: string) {
  return prisma.course.findFirst({
    where: { id: courseId, teacherId },
  });
}

export async function getTeacherCourseStudents(teacherId: string, courseId: string) {
  const course = await getTeacherCourseForPortal(teacherId, courseId);
  if (!course) return null;

  const enrollments = await getEnrollmentsForCourse(courseId);
  return { course, enrollments };
}

export async function getTeacherEnrollmentInCourse(
  teacherId: string,
  courseId: string,
  enrollmentId: string,
) {
  const course = await getTeacherCourseForPortal(teacherId, courseId);
  if (!course) return null;

  const enrollment = await prisma.enrollment.findFirst({
    where: { id: enrollmentId, courseId },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });
  if (!enrollment) return null;

  return { course, enrollment };
}

export function teacherDashboardStats(courses: TeacherCourse[]) {
  const byStatus = courses.reduce(
    (acc, course) => {
      acc[course.status] = (acc[course.status] ?? 0) + 1;
      return acc;
    },
    {} as Partial<Record<CourseStatus, number>>,
  );

  return {
    totalCourses: courses.length,
    totalStudents: courses.reduce((sum, c) => sum + c.studentCount, 0),
    byStatus,
  };
}

export type TeacherProfile = Pick<Teacher, "id" | "name" | "email" | "specialization" | "initials">;
