import { Prisma, PrismaClient } from "@prisma/client";

/** Bump when the Prisma schema changes so dev HMR does not keep an outdated client. */
const PRISMA_CLIENT_CACHE_KEY = "20260603120000_enrollment_uploaded_certificate";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaCacheKey?: string;
};

function enrollmentModelHasUploadedCertificatePath(): boolean {
  return Prisma.dmmf.datamodel.models
    .find((model) => model.name === "Enrollment")
    ?.fields.some((field) => field.name === "uploadedCertificatePath") ?? false;
}

function createPrismaClient() {
  return new PrismaClient();
}

/** Avoid reusing a stale Prisma client cached before schema changes. */
function getPrismaClient(): PrismaClient {
  const cached = globalForPrisma.prisma;
  const cacheKeyMatches = globalForPrisma.prismaCacheKey === PRISMA_CLIENT_CACHE_KEY;

  if (
    cached &&
    cacheKeyMatches &&
    typeof cached.course?.findMany === "function" &&
    enrollmentModelHasUploadedCertificatePath()
  ) {
    return cached;
  }

  const client = createPrismaClient();

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
    globalForPrisma.prismaCacheKey = PRISMA_CLIENT_CACHE_KEY;
  }

  return client;
}

export const prisma = getPrismaClient();
