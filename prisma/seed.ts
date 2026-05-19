import { PrismaClient } from "@prisma/client";
import { getDefaultFeesForLevel } from "../lib/course-pricing";
import { courses } from "../content/courses";
import { libraryItems } from "../content/library";
import { teachers } from "../content/teachers";

const prisma = new PrismaClient();

async function main() {
  for (const course of courses) {
    const fees = getDefaultFeesForLevel(course.level);
    await prisma.course.upsert({
      where: { id: course.id },
      create: {
        id: course.id,
        title: course.title,
        description: course.description,
        startDate: course.startDate,
        level: course.level,
        category: course.category,
        priceInrPaise: 0,
        monthlyFeeInrPaise: fees.monthlyFeePaise,
        teacherId: course.teacherId,
        status: "PUBLISHED",
      },
      update: {
        title: course.title,
        description: course.description,
        startDate: course.startDate,
        level: course.level,
        category: course.category,
        monthlyFeeInrPaise: fees.monthlyFeePaise,
        teacherId: course.teacherId,
      },
    });
  }

  for (const teacher of teachers) {
    await prisma.teacher.upsert({
      where: { id: teacher.id },
      create: {
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
        specialization: teacher.specialization,
        bio: teacher.bio,
        initials: teacher.initials,
        published: true,
      },
      update: {
        name: teacher.name,
        email: teacher.email,
        specialization: teacher.specialization,
        bio: teacher.bio,
        initials: teacher.initials,
      },
    });
  }

  for (const item of libraryItems) {
    await prisma.libraryItem.upsert({
      where: { id: item.id },
      create: {
        id: item.id,
        title: item.title,
        author: item.author,
        topic: item.topic,
        level: item.level,
        language: item.language,
        published: true,
      },
      update: {
        title: item.title,
        author: item.author,
        topic: item.topic,
        level: item.level,
        language: item.language,
      },
    });
  }

  console.log("Seeded courses, teachers, and library items.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
