import { prisma } from "@/lib/prisma";
import type { DailyInspirationKind } from "@prisma/client";
import { clampPage, paginationArgs, type PaginatedResult } from "@/lib/pagination";
import { buildSearchOr } from "@/lib/text-search";

function dailyInspirationAdminWhere(searchQuery?: string) {
  if (!searchQuery) return undefined;
  return buildSearchOr(["arabicText", "englishTranslation", "reference"], [], searchQuery);
}

export type DailyInspirationRecord = {
  id: string;
  kind: DailyInspirationKind;
  arabicText: string;
  englishTranslation: string;
  reference: string | null;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export function dailyInspirationKindLabel(kind: DailyInspirationKind): string {
  return kind === "QURAN" ? "Quranic verse" : "Hadith";
}

export function dailyInspirationHomeTitle(kind: DailyInspirationKind): string {
  return kind === "QURAN" ? "Quranic Verse of the Day" : "Hadith of the Day";
}

export async function getHomepageDailyInspiration(): Promise<DailyInspirationRecord | null> {
  return prisma.dailyInspiration.findFirst({
    where: { published: true },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      kind: true,
      arabicText: true,
      englishTranslation: true,
      reference: true,
      published: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function getAllDailyInspirationsForAdmin() {
  return prisma.dailyInspiration.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      kind: true,
      arabicText: true,
      englishTranslation: true,
      reference: true,
      published: true,
      updatedAt: true,
    },
  });
}

const dailyInspirationAdminSelect = {
  id: true,
  kind: true,
  arabicText: true,
  englishTranslation: true,
  reference: true,
  published: true,
  createdAt: true,
  updatedAt: true,
} as const;

export async function getAllDailyInspirationsForAdminPaginated(
  page: number,
  pageSize: number,
  searchQuery?: string,
): Promise<PaginatedResult<DailyInspirationRecord>> {
  const where = dailyInspirationAdminWhere(searchQuery);
  const totalCount = await prisma.dailyInspiration.count({ where });
  const safePage = clampPage(page, totalCount, pageSize);
  const items = await prisma.dailyInspiration.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    select: dailyInspirationAdminSelect,
    ...paginationArgs(safePage, pageSize),
  });
  return { items, totalCount };
}

export async function getDailyInspirationForAdmin(id: string) {
  return prisma.dailyInspiration.findUnique({
    where: { id },
    select: {
      id: true,
      kind: true,
      arabicText: true,
      englishTranslation: true,
      reference: true,
      published: true,
    },
  });
}

export async function getHomepageDailyInspirationId(): Promise<string | null> {
  const current = await getHomepageDailyInspiration();
  return current?.id ?? null;
}
