import type { Course as PrismaCourse, CourseStatus, Teacher } from "@prisma/client";
import { isCoursePubliclyVisible } from "@/lib/course-status";
import { prisma } from "@/lib/prisma";

export type Course = PrismaCourse;
export type CourseLevel = "Beginner" | "Intermediate" | "Advanced";

export type CourseWithTeacher = Course & {
  teacher: Teacher | null;
};

const courseWithTeacherInclude = { teacher: true } as const;

export function formatPrice(paise: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise / 100);
}

export async function getPublicCourses(): Promise<CourseWithTeacher[]> {
  const courses = await prisma.course.findMany({
    include: courseWithTeacherInclude,
    orderBy: { createdAt: "desc" },
  });
  return courses.filter((c) => isCoursePubliclyVisible(c.status));
}

export async function getAllCourses(): Promise<CourseWithTeacher[]> {
  return prisma.course.findMany({
    include: courseWithTeacherInclude,
    orderBy: { createdAt: "desc" },
  });
}

export async function getCourseById(id: string): Promise<CourseWithTeacher | null> {
  return prisma.course.findUnique({
    where: { id },
    include: courseWithTeacherInclude,
  });
}

export async function getPublicCourseById(id: string): Promise<CourseWithTeacher | null> {
  const course = await getCourseById(id);
  if (!course || !isCoursePubliclyVisible(course.status)) return null;
  return course;
}

export async function getCoursesByStatus(status: CourseStatus): Promise<CourseWithTeacher[]> {
  return prisma.course.findMany({
    where: { status },
    include: courseWithTeacherInclude,
    orderBy: { createdAt: "desc" },
  });
}

/** @deprecated Use getPublicCourses */
export const getPublishedCourses = getPublicCourses;

/** @deprecated Use getPublicCourseById */
export const getPublishedCourseById = getPublicCourseById;
