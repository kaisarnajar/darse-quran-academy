import type { Course as PrismaCourse, Teacher } from "@prisma/client";
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

export async function getPublishedCourses(): Promise<CourseWithTeacher[]> {
  return prisma.course.findMany({
    where: { published: true },
    include: courseWithTeacherInclude,
    orderBy: { createdAt: "desc" },
  });
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

export async function getPublishedCourseById(id: string): Promise<CourseWithTeacher | null> {
  return prisma.course.findFirst({
    where: { id, published: true },
    include: courseWithTeacherInclude,
  });
}
