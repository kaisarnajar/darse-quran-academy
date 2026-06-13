import { PrismaClient } from "@prisma/client";
import { seedBootstrap } from "./seed-bootstrap";
import { demoContentLoginHint, seedDemoContent } from "./seed-demo-content";
import {
  demoAdminLoginHint,
  demoDataSummaryHint,
  demoStudentLoginHint,
  demoTeacherLoginHint,
  seedDemoAdmins,
  seedDemoData,
  seedDemoTeachers,
} from "./seed-demo-data";

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

async function assertDatabaseMigrated() {
  const checks = [
    () => prisma.course.findFirst({ select: { featuredOnHomepage: true, status: true } }),
    () => prisma.paymentSettings.findFirst({ select: { id: true } }),
    () => prisma.socialLinksSettings.findFirst({ select: { id: true } }),
    () =>
      prisma.coursePaymentSubmission.findFirst({
        select: { paymentType: true, paymentReference: true },
      }),
    () =>
      prisma.enrollment.findFirst({
        select: { uploadedCertificatePath: true, certificateEmailSentAt: true },
      }),
    () =>
      prisma.paymentRecord.findFirst({
        select: { uploadedReceiptPath: true, receiptEmailSentAt: true },
      }),
    () => prisma.blogImage.findFirst({ select: { id: true } }),
    () => prisma.fatwaQuestion.findFirst({ select: { featuredOnHomepage: true } }),
    () => prisma.studentReview.findFirst({ select: { rating: true, status: true } }),
  ];

  try {
    await Promise.all(checks.map((check) => check()));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("does not exist")) {
      console.error(
        "Database schema is missing or out of date. Run `npm run db:migrate` first, then `npm run db:seed:demo`.",
      );
      process.exit(1);
    }
    throw error;
  }
}

async function main() {
  assertDemoSeedAllowed();
  await assertDatabaseMigrated();

  await seedBootstrap(prisma);
  await seedDemoAdmins(prisma);
  await seedDemoTeachers(prisma);
  await seedDemoData(prisma);
  await seedDemoContent(prisma);

  console.log(
    "Seeded demo data: courses, teachers, library, testimonials, logins, students, contact inquiries, announcements, blogs, verse/hadith, and fatwa.",
  );
  console.log(demoDataSummaryHint());
  console.log(demoContentLoginHint());
  console.log(demoAdminLoginHint());
  console.log(demoTeacherLoginHint());
  console.log(demoStudentLoginHint());
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
