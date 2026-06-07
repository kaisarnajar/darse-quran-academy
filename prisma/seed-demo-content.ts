import type { PrismaClient } from "@prisma/client";
import {
  demoBlogPosts,
  demoCourseAnnouncements,
  demoDailyInspirations,
  demoFatwaQuestions,
  demoSiteAnnouncements,
} from "../content/demo-content";

function demoTeacherUserId(teacherId: string) {
  return `seed-demo-teacher-user-${teacherId}`;
}

function demoStudentUserId(studentId: string) {
  return `seed-demo-user-${studentId}`;
}

const demoContentBaseTime = new Date("2026-02-01T10:00:00.000Z");

function staggeredDate(index: number, minutes = 30) {
  return new Date(demoContentBaseTime.getTime() + index * minutes * 60_000);
}

/** Site announcements, blogs, verse/hadith, fatwa, and course announcements for local QA. */
export async function seedDemoContent(prisma: PrismaClient) {
  const answererId = demoTeacherUserId("1");

  for (const [index, item] of demoSiteAnnouncements.entries()) {
    const createdAt = staggeredDate(index);
    await prisma.siteAnnouncement.upsert({
      where: { id: item.id },
      create: {
        id: item.id,
        title: item.title,
        body: item.body,
        eventDate: item.eventDate ?? null,
        location: item.location ?? null,
        published: item.published,
        showOnHomepage: item.showOnHomepage,
        createdAt,
        updatedAt: createdAt,
      },
      update: {
        title: item.title,
        body: item.body,
        eventDate: item.eventDate ?? null,
        location: item.location ?? null,
        published: item.published,
        showOnHomepage: item.showOnHomepage,
      },
    });
  }

  for (const [index, item] of demoBlogPosts.entries()) {
    const createdAt = staggeredDate(10 + index);
    const createdById = item.teacherId ? demoTeacherUserId(item.teacherId) : null;

    await prisma.blogPost.upsert({
      where: { id: item.id },
      create: {
        id: item.id,
        title: item.title,
        excerpt: item.excerpt ?? null,
        body: item.body,
        published: item.published,
        approvalStatus: item.approvalStatus,
        createdById,
        createdAt,
        updatedAt: createdAt,
      },
      update: {
        title: item.title,
        excerpt: item.excerpt ?? null,
        body: item.body,
        published: item.published,
        approvalStatus: item.approvalStatus,
        createdById,
      },
    });
  }

  const homepageInspiration = demoDailyInspirations.find((item) => item.onHomepage);
  const homepageUpdatedAt = new Date("2026-06-01T12:00:00.000Z");

  for (const [index, item] of demoDailyInspirations.entries()) {
    const updatedAt =
      item.id === homepageInspiration?.id
        ? homepageUpdatedAt
        : new Date(homepageUpdatedAt.getTime() - (index + 1) * 86_400_000);
    const createdAt = new Date(updatedAt.getTime() - 7 * 86_400_000);

    await prisma.dailyInspiration.upsert({
      where: { id: item.id },
      create: {
        id: item.id,
        kind: item.kind,
        arabicText: item.arabicText,
        englishTranslation: item.englishTranslation,
        reference: item.reference ?? null,
        published: item.published,
        createdById: answererId,
        createdAt,
        updatedAt,
      },
      update: {
        kind: item.kind,
        arabicText: item.arabicText,
        englishTranslation: item.englishTranslation,
        reference: item.reference ?? null,
        published: item.published,
        updatedAt,
      },
    });
  }

  for (const [index, item] of demoFatwaQuestions.entries()) {
    const createdAt = staggeredDate(20 + index);
    const answered = Boolean(item.answer);
    const answeredAt = answered
      ? new Date(createdAt.getTime() + 2 * 86_400_000)
      : null;

    await prisma.fatwaQuestion.upsert({
      where: { id: item.id },
      create: {
        id: item.id,
        userId: item.studentId ? demoStudentUserId(item.studentId) : null,
        askerName: item.askerName,
        askerEmail: item.askerEmail,
        category: item.category,
        title: item.title,
        question: item.question,
        answer: item.answer ?? null,
        answeredAt,
        answeredById: answered ? answererId : null,
        createdAt,
        updatedAt: answeredAt ?? createdAt,
      },
      update: {
        userId: item.studentId ? demoStudentUserId(item.studentId) : null,
        askerName: item.askerName,
        askerEmail: item.askerEmail,
        category: item.category,
        title: item.title,
        question: item.question,
        answer: item.answer ?? null,
        answeredAt,
        answeredById: answered ? answererId : null,
      },
    });
  }

  for (const [index, item] of demoCourseAnnouncements.entries()) {
    const createdAt = staggeredDate(30 + index);

    await prisma.courseAnnouncement.upsert({
      where: { id: item.id },
      create: {
        id: item.id,
        courseId: item.courseId,
        enrollmentId: item.enrollmentId ?? null,
        teacherId: item.teacherId ?? null,
        authorName: item.authorName,
        postedByAdmin: item.postedByAdmin ?? false,
        category: item.category,
        title: item.title,
        body: item.body,
        createdAt,
        updatedAt: createdAt,
      },
      update: {
        courseId: item.courseId,
        enrollmentId: item.enrollmentId ?? null,
        teacherId: item.teacherId ?? null,
        authorName: item.authorName,
        postedByAdmin: item.postedByAdmin ?? false,
        category: item.category,
        title: item.title,
        body: item.body,
      },
    });
  }
}

export function demoContentLoginHint(): string {
  return [
    "Demo content seeded:",
    "  Announcements — 4 homepage + 1 published only + 1 draft",
    "  Blogs — published, approved-unpublished, draft, pending, rejected",
    "  Verse/Hadith — 1 live on homepage (Qur'an 94:6), 1 published hadith, 2 drafts",
    "  Fatwa — 3 pending + 3 answered on /fatwa",
    "  Course announcements — admin, teacher, and private student message",
  ].join("\n");
}
