import type { Teacher as PrismaTeacher } from "@prisma/client";
import { clampPage, paginationArgs, type PaginatedResult } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";

export type Teacher = PrismaTeacher;

export async function getPublishedTeachers(): Promise<Teacher[]> {
  return prisma.teacher.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPublishedTeachersPaginated(
  page: number,
  pageSize: number,
): Promise<PaginatedResult<Teacher>> {
  const where = { published: true };
  const totalCount = await prisma.teacher.count({ where });
  const safePage = clampPage(page, totalCount, pageSize);
  const items = await prisma.teacher.findMany({
    where,
    orderBy: { createdAt: "desc" },
    ...paginationArgs(safePage, pageSize),
  });
  return { items, totalCount };
}

export async function getAllTeachers(): Promise<Teacher[]> {
  return prisma.teacher.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getAllTeachersPaginated(
  page: number,
  pageSize: number,
): Promise<PaginatedResult<Teacher>> {
  const totalCount = await prisma.teacher.count();
  const safePage = clampPage(page, totalCount, pageSize);
  const items = await prisma.teacher.findMany({
    orderBy: { createdAt: "desc" },
    ...paginationArgs(safePage, pageSize),
  });
  return { items, totalCount };
}

export async function getTeacherById(id: string): Promise<Teacher | null> {
  return prisma.teacher.findUnique({ where: { id } });
}

export async function getPublishedTeacherById(id: string): Promise<Teacher | null> {
  return prisma.teacher.findFirst({
    where: { id, published: true },
  });
}
