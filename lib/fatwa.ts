import type { FatwaQuestion } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const FATWA_CATEGORIES = ["Islam", "Atheism", "Fatwa", "Other"] as const;
export type FatwaCategory = (typeof FATWA_CATEGORIES)[number];

export function isFatwaCategory(value: string): value is FatwaCategory {
  return FATWA_CATEGORIES.includes(value as FatwaCategory);
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
  const base = process.env.AUTH_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
  return `${base.replace(/\/$/, "")}/fatwa/${id}`;
}

export function excerpt(text: string, maxLength = 160): string {
  const trimmed = text.trim().replace(/\s+/g, " ");
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength).trim()}…`;
}
