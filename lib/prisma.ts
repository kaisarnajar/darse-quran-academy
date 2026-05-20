import { Prisma, PrismaClient } from "@prisma/client";

/** Bump when the Prisma schema changes so dev HMR does not keep an outdated client. */
const PRISMA_CLIENT_CACHE_KEY = "20260604120000_payment_record_receipt";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaCacheKey?: string;
};

function prismaSchemaIsCurrent(): boolean {
  const enrollment = Prisma.dmmf.datamodel.models.find((model) => model.name === "Enrollment");
  const paymentRecord = Prisma.dmmf.datamodel.models.find((model) => model.name === "PaymentRecord");
  return (
    (enrollment?.fields.some((field) => field.name === "uploadedCertificatePath") ?? false) &&
    (paymentRecord?.fields.some((field) => field.name === "uploadedReceiptPath") ?? false)
  );
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
    prismaSchemaIsCurrent()
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
