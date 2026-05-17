import type { Teacher as PrismaTeacher } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type Teacher = PrismaTeacher;

export async function getPublishedTeachers(): Promise<Teacher[]> {
  return prisma.teacher.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAllTeachers(): Promise<Teacher[]> {
  return prisma.teacher.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getTeacherById(id: string): Promise<Teacher | null> {
  return prisma.teacher.findUnique({ where: { id } });
}
