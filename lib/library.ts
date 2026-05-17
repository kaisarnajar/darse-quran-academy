import type { LibraryItem as PrismaLibraryItem } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type LibraryItem = PrismaLibraryItem;

export async function getPublishedLibraryItems(): Promise<LibraryItem[]> {
  return prisma.libraryItem.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAllLibraryItems(): Promise<LibraryItem[]> {
  return prisma.libraryItem.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getLibraryItemById(id: string): Promise<LibraryItem | null> {
  return prisma.libraryItem.findUnique({ where: { id } });
}
