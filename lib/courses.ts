import type { Course as PrismaCourse } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type Course = PrismaCourse;
export type CourseLevel = "Beginner" | "Intermediate" | "Advanced";

export function formatPrice(paise: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise / 100);
}

export async function getPublishedCourses(): Promise<Course[]> {
  return prisma.course.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAllCourses(): Promise<Course[]> {
  return prisma.course.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getCourseById(id: string): Promise<Course | null> {
  return prisma.course.findUnique({ where: { id } });
}

export async function getPublishedCourseById(id: string): Promise<Course | null> {
  return prisma.course.findFirst({
    where: { id, published: true },
  });
}
