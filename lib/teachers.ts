import type { Teacher as PrismaTeacher } from "@prisma/client";
import { clampPage, paginationArgs, type PaginatedResult } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";
import { buildSearchOr } from "@/lib/text-search";

function allTeachersWhere(searchQuery?: string) {
  if (!searchQuery) return undefined;
  return buildSearchOr(["name", "email", "specialization"], [], searchQuery);
}

export type Teacher = PrismaTeacher;

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
  searchQuery?: string,
): Promise<PaginatedResult<Teacher>> {
  const where = allTeachersWhere(searchQuery);
  const totalCount = await prisma.teacher.count({ where });
  const safePage = clampPage(page, totalCount, pageSize);
  const items = await prisma.teacher.findMany({
    where,
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
