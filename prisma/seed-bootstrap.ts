import type { PrismaClient } from "@prisma/client";
import { getDefaultFeesForLevel } from "../lib/course-pricing";
import { courses } from "../content/courses";
import { libraryItems } from "../content/library";
import { studentTestimonials } from "../content/testimonials";
import { teachers } from "../content/teachers";

/** Minimal bootstrap data: courses, teachers, library, homepage testimonials. */
export async function seedBootstrap(prisma: PrismaClient) {
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

  const featuredAtBase = new Date("2026-01-01T00:00:00.000Z");
  for (const [index, testimonial] of studentTestimonials.entries()) {
    const userId = `seed-testimonial-user-${testimonial.id}`;
    const reviewId = `seed-testimonial-${testimonial.id}`;
    const email = `seed-testimonial-${testimonial.id}@seed.local`;

    await prisma.user.upsert({
      where: { id: userId },
      create: {
        id: userId,
        email,
        name: testimonial.name,
      },
      update: {
        name: testimonial.name,
      },
    });

    await prisma.studentReview.upsert({
      where: { id: reviewId },
      create: {
        id: reviewId,
        userId,
        quote: testimonial.quote,
        course: testimonial.course,
        location: testimonial.location,
        status: "APPROVED",
        featuredOnHomepage: true,
        featuredAt: new Date(featuredAtBase.getTime() + index * 60_000),
      },
      update: {
        quote: testimonial.quote,
        course: testimonial.course,
        location: testimonial.location,
        status: "APPROVED",
        featuredOnHomepage: true,
      },
    });
  }
}
