import type { PrismaClient, StudentNotificationType } from "@prisma/client";
import { demoStudentUserId } from "./seed-helpers";

type DemoNotificationSeed = {
  id: string;
  studentId: string;
  type: StudentNotificationType;
  title: string;
  body?: string;
  href: string;
  sourceType?: string;
  sourceId?: string;
  readAt?: Date | null;
  createdAt: Date;
};

const demoNotifications: DemoNotificationSeed[] = [
  // Student 06 — primary QA account with mixed read/unread notifications
  {
    id: "seed-demo-notification-06-enrollment-approved",
    studentId: "06",
    type: "ENROLLMENT_APPROVED",
    title: "Enrollment approved — Quran Nazira (Reading)",
    body: "You can now access your course from My Courses.",
    href: "/profile/courses",
    sourceType: "Enrollment",
    sourceId: "seed-demo-enrollment-06-quran-nazira",
    readAt: new Date("2026-01-12T09:00:00.000Z"),
    createdAt: new Date("2026-01-11T10:00:00.000Z"),
  },
  {
    id: "seed-demo-notification-06-payment-enrollment",
    studentId: "06",
    type: "PAYMENT_APPROVED",
    title: "Payment approved — Quran Nazira (Reading)",
    body: "Your payment has been verified. You can view details and download your receipt from Payments.",
    href: "/profile/payments",
    sourceType: "CoursePaymentSubmission",
    sourceId: "seed-demo-payment-06-quran-nazira-enrollment",
    readAt: new Date("2026-01-14T11:00:00.000Z"),
    createdAt: new Date("2026-01-13T10:00:00.000Z"),
  },
  {
    id: "seed-demo-notification-06-payment-monthly",
    studentId: "06",
    type: "PAYMENT_APPROVED",
    title: "Payment approved — Quran Nazira (Reading)",
    body: "Your payment has been verified. You can view details and download your receipt from Payments.",
    href: "/profile/payments",
    sourceType: "CoursePaymentSubmission",
    sourceId: "seed-demo-payment-06-quran-nazira-01-2026",
    readAt: null,
    createdAt: new Date("2026-02-16T10:00:00.000Z"),
  },
  {
    id: "seed-demo-notification-06-course-announcement",
    studentId: "06",
    type: "COURSE_ANNOUNCEMENT",
    title: "Quran Nazira (Reading): Welcome to Quran Nazira",
    body: "Classes begin next Monday. Please join five minutes early to test your audio.",
    href: "/profile/courses/quran-nazira/announcements",
    sourceType: "CourseAnnouncement",
    sourceId: "seed-demo-course-announcement-1",
    readAt: null,
    createdAt: new Date("2026-02-01T10:00:00.000Z"),
  },
  {
    id: "seed-demo-notification-06-personal-message",
    studentId: "06",
    type: "PERSONAL_MESSAGE",
    title: "Message from Moulana Ibrahim Khan — Quran Nazira (Reading)",
    body: "Private message for Bilal Ahmad: Your Tajweed assessment is scheduled for next Tuesday. Reply if you need a different slot.",
    href: "/profile/courses/quran-nazira/announcements",
    sourceType: "CourseAnnouncement",
    sourceId: "seed-demo-course-announcement-4",
    readAt: null,
    createdAt: new Date("2026-02-03T10:00:00.000Z"),
  },
  {
    id: "seed-demo-notification-06-site-announcement",
    studentId: "06",
    type: "SITE_ANNOUNCEMENT",
    title: "Annual Hifz Graduation Ceremony",
    body: "Join us to celebrate students who completed their Hifz this academic year. Families and guests are welcome after Maghrib.",
    href: "/announcements/seed-demo-announcement-1",
    sourceType: "SiteAnnouncement",
    sourceId: "seed-demo-announcement-1",
    readAt: null,
    createdAt: new Date("2026-02-01T10:00:00.000Z"),
  },
  // Student 07 — mostly read notifications
  {
    id: "seed-demo-notification-07-enrollment-approved",
    studentId: "07",
    type: "ENROLLMENT_APPROVED",
    title: "Enrollment approved — Hifz Foundation",
    body: "You can now access your course from My Courses.",
    href: "/profile/courses",
    sourceType: "Enrollment",
    sourceId: "seed-demo-enrollment-07-hifz-foundation",
    readAt: new Date("2026-01-20T09:00:00.000Z"),
    createdAt: new Date("2026-01-19T10:00:00.000Z"),
  },
  {
    id: "seed-demo-notification-07-course-announcement",
    studentId: "07",
    type: "COURSE_ANNOUNCEMENT",
    title: "Hifz Foundation: Memorize Surah al-Mulk ayat 1–5",
    body: "Submit your recitation recording link in the next private message thread.",
    href: "/profile/courses/hifz-foundation/announcements",
    sourceType: "CourseAnnouncement",
    sourceId: "seed-demo-course-announcement-3",
    readAt: new Date("2026-02-05T12:00:00.000Z"),
    createdAt: new Date("2026-02-04T10:00:00.000Z"),
  },
  // Student 03 — declined enrollment example
  {
    id: "seed-demo-notification-03-enrollment-rejected",
    studentId: "03",
    type: "ENROLLMENT_REJECTED",
    title: "Enrollment declined — Daily Duas & Adab",
    body: "Your enrollment request was not approved. Contact the academy if you have questions.",
    href: "/profile/courses",
    sourceType: "Enrollment",
    sourceId: "seed-demo-enrollment-03-dua-daily-adab",
    readAt: null,
    createdAt: new Date("2026-01-25T14:00:00.000Z"),
  },
  // Student 11 — sisters batch course announcements
  {
    id: "seed-demo-notification-11-site-announcement",
    studentId: "11",
    type: "SITE_ANNOUNCEMENT",
    title: "New Nazira Batch — Open Enrollment",
    body: "A fresh Nazira batch for beginners starts next month. Limited seats; complete your profile before requesting enrollment.",
    href: "/announcements/seed-demo-announcement-4",
    sourceType: "SiteAnnouncement",
    sourceId: "seed-demo-announcement-4",
    readAt: null,
    createdAt: new Date("2026-02-02T10:00:00.000Z"),
  },
  {
    id: "seed-demo-notification-11-course-announcement",
    studentId: "11",
    type: "COURSE_ANNOUNCEMENT",
    title: "Quran Nazira — Sisters Batch: Sisters batch — Noorani Qaida PDF",
    body: "Download the attached Qaida pages before Monday's class. Focus on letters with heavy makhraj practice.",
    href: "/profile/courses/quran-nazira-women/announcements",
    sourceType: "CourseAnnouncement",
    sourceId: "seed-demo-course-announcement-5",
    readAt: null,
    createdAt: new Date("2026-02-06T10:00:00.000Z"),
  },
];

/** Student in-app notifications for /profile/notifications QA. */
export async function seedDemoNotifications(prisma: PrismaClient) {
  for (const item of demoNotifications) {
    const userId = demoStudentUserId(item.studentId);
    const sourceId = item.sourceId ?? null;

    if (sourceId) {
      await prisma.studentNotification.upsert({
        where: {
          userId_type_sourceId: {
            userId,
            type: item.type,
            sourceId,
          },
        },
        create: {
          id: item.id,
          userId,
          type: item.type,
          title: item.title,
          body: item.body ?? null,
          href: item.href,
          sourceType: item.sourceType ?? null,
          sourceId,
          readAt: item.readAt ?? null,
          createdAt: item.createdAt,
        },
        update: {
          title: item.title,
          body: item.body ?? null,
          href: item.href,
          sourceType: item.sourceType ?? null,
          readAt: item.readAt ?? null,
        },
      });
      continue;
    }

    await prisma.studentNotification.upsert({
      where: { id: item.id },
      create: {
        id: item.id,
        userId,
        type: item.type,
        title: item.title,
        body: item.body ?? null,
        href: item.href,
        sourceType: item.sourceType ?? null,
        sourceId: null,
        readAt: item.readAt ?? null,
        createdAt: item.createdAt,
      },
      update: {
        title: item.title,
        body: item.body ?? null,
        href: item.href,
        sourceType: item.sourceType ?? null,
        readAt: item.readAt ?? null,
      },
    });
  }
}

export function demoNotificationsHint(): string {
  return [
    "  Notifications — student 06 (4 unread), student 07 (all read), student 03 (declined), student 11 (2 unread)",
    "    Login demo-student-06@seed.local → /profile/notifications for the full notification types demo",
  ].join("\n");
}
