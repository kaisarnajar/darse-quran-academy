import { PrismaClient } from "@prisma/client";
import { seedBootstrap } from "./seed-bootstrap";

const prisma = new PrismaClient();

async function main() {
  await seedBootstrap(prisma);
  console.log("Seeded courses, teachers, library items, and student testimonials.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
