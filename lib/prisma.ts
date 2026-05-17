import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient() {
  return new PrismaClient();
}

/** Avoid reusing a stale Prisma client cached before schema changes (e.g. missing `course`). */
function getPrismaClient(): PrismaClient {
  const cached = globalForPrisma.prisma;
  if (cached && typeof cached.course?.findMany === "function") {
    return cached;
  }

  const client = createPrismaClient();

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }

  return client;
}

export const prisma = getPrismaClient();
