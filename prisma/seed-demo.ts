import { PrismaClient } from "@prisma/client";
import { seedBootstrap } from "./seed-bootstrap";
import { demoStudentLoginHint, seedDemoData } from "./seed-demo-data";

function assertDemoSeedAllowed() {
  if (process.env.NODE_ENV === "production" && process.env.ALLOW_DEMO_SEED !== "true") {
    console.error(
      "Demo seed is blocked when NODE_ENV=production. Set ALLOW_DEMO_SEED=true to override.",
    );
    process.exit(1);
  }

  const url = process.env.DATABASE_URL ?? "";
  const isPostgres = url.startsWith("postgres://") || url.startsWith("postgresql://");
  if (isPostgres && process.env.ALLOW_DEMO_SEED !== "true") {
    console.error(
      "Demo seed is blocked for PostgreSQL. Use local SQLite, or set ALLOW_DEMO_SEED=true for staging.",
    );
    process.exit(1);
  }
}

const prisma = new PrismaClient();

async function main() {
  assertDemoSeedAllowed();

  await seedBootstrap(prisma);
  await seedDemoData(prisma);

  console.log("Seeded bootstrap data and 25 demo students with enrollments and payments.");
  console.log(demoStudentLoginHint());
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
