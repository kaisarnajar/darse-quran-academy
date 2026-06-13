import type { FatwaQuestion } from "@prisma/client";
import { resolveHomepageFeaturedUpdate } from "@/lib/homepage-featured";
import { prisma } from "@/lib/prisma";

export const HOMEPAGE_FEATURED_FATWA_MAX = 4;

export const FATWA_CATEGORIES = [
  "Islam",
  "Quran",
  "Hadith",
  "Fiqh",
  "Tajweed",
  "Seerah",
  "Arabic Language",
  "Atheism",
  "Fatwa",
  "Other",
] as const;
export type FatwaCategory = (typeof FATWA_CATEGORIES)[number];

export function isFatwaCategory(value: string): value is FatwaCategory {
  return FATWA_CATEGORIES.includes(value as FatwaCategory);
}

export function isFatwaAnswered(fatwa: Pick<FatwaQuestion, "answer">): boolean {
  return fatwa.answer != null && fatwa.answer.trim().length > 0;
}

export async function getFeaturedHomepageFatwas(): Promise<FatwaQuestion[]> {
  const fatwas = await prisma.fatwaQuestion.findMany({
    where: { featuredOnHomepage: true, answer: { not: null } },
    orderBy: [{ featuredAt: "desc" }, { answeredAt: "desc" }],
    take: HOMEPAGE_FEATURED_FATWA_MAX,
  });
  return fatwas.filter(isFatwaAnswered);
}

export async function getFeaturedHomepageFatwaCount(): Promise<number> {
  const fatwas = await prisma.fatwaQuestion.findMany({
    where: { featuredOnHomepage: true, answer: { not: null } },
    select: { answer: true },
  });
  return fatwas.filter(isFatwaAnswered).length;
}

export async function resolveFatwaFeaturedUpdate(options: {
  fatwa: Pick<FatwaQuestion, "answer" | "featuredOnHomepage" | "featuredAt">;
  requestFeatured: boolean;
}) {
  const featuredCount = await getFeaturedHomepageFatwaCount();
  return resolveHomepageFeaturedUpdate({
    isEligible: isFatwaAnswered(options.fatwa),
    requestFeatured: options.requestFeatured,
    currentlyFeatured: options.fatwa.featuredOnHomepage,
    currentFeaturedAt: options.fatwa.featuredAt,
    featuredCount,
    maxFeatured: HOMEPAGE_FEATURED_FATWA_MAX,
    resourceLabel: "fatwa answers",
  });
}

export async function getAnsweredFatwas(category?: string): Promise<FatwaQuestion[]> {
  return prisma.fatwaQuestion.findMany({
    where: {
      answer: { not: null },
      ...(category && isFatwaCategory(category) ? { category } : {}),
    },
    orderBy: { answeredAt: "desc" },
  });
}

export async function getAnsweredFatwaById(id: string): Promise<FatwaQuestion | null> {
  return prisma.fatwaQuestion.findFirst({
    where: { id, answer: { not: null } },
  });
}

export async function getAllFatwaQuestions(filter?: "pending" | "answered"): Promise<FatwaQuestion[]> {
  return prisma.fatwaQuestion.findMany({
    where:
      filter === "pending"
        ? { answer: null }
        : filter === "answered"
          ? { answer: { not: null } }
          : undefined,
    orderBy: { createdAt: "desc" },
  });
}

export async function getFatwaQuestionById(id: string): Promise<FatwaQuestion | null> {
  return prisma.fatwaQuestion.findUnique({ where: { id } });
}

export function getFatwaPublicUrl(id: string): string {
  const base = process.env.AUTH_URL || "http://localhost:3000";
  return `${base.replace(/\/$/, "")}/fatwa/${id}`;
}

export function excerpt(text: string, maxLength = 160): string {
  const trimmed = text.trim().replace(/\s+/g, " ");
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength).trim()}…`;
}
