import type { AnnouncementCategory, CourseAnnouncement } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const ANNOUNCEMENT_MAX_UPLOAD_BYTES = 1 * 1024 * 1024;

export const ANNOUNCEMENT_LARGE_FILE_MESSAGE =
  "This file is larger than 1 MB. Kindly upload the file to Google Drive and share the link here.";

export function isAnnouncementAttachmentTooLarge(fileSizeBytes: number): boolean {
  return fileSizeBytes > ANNOUNCEMENT_MAX_UPLOAD_BYTES;
}

export const ANNOUNCEMENT_CATEGORIES: AnnouncementCategory[] = [
  "EXAMS_TESTS",
  "ASSIGNMENTS_HOMEWORK",
  "STUDY_MATERIALS",
  "CLASS_SCHEDULE",
  "COURSE_ANNOUNCEMENT",
  "GENERAL_NOTICE",
];

export const announcementCategoryLabels: Record<AnnouncementCategory, string> = {
  EXAMS_TESTS: "Exams & Tests",
  ASSIGNMENTS_HOMEWORK: "Assignments & Homework",
  STUDY_MATERIALS: "Study Materials",
  CLASS_SCHEDULE: "Class Schedule",
  COURSE_ANNOUNCEMENT: "Course Announcements",
  GENERAL_NOTICE: "General Notices",
};

export const announcementCategoryStyles: Record<AnnouncementCategory, string> = {
  EXAMS_TESTS: "bg-red-100 text-red-900",
  ASSIGNMENTS_HOMEWORK: "bg-orange-100 text-orange-900",
  STUDY_MATERIALS: "bg-blue-100 text-blue-900",
  CLASS_SCHEDULE: "bg-violet-100 text-violet-900",
  COURSE_ANNOUNCEMENT: "bg-teal/15 text-teal-dark",
  GENERAL_NOTICE: "bg-stone-200 text-stone-800",
};

export function formatAnnouncementDate(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export async function getAnnouncementsForCourse(courseId: string) {
  return prisma.courseAnnouncement.findMany({
    where: { courseId },
    orderBy: { createdAt: "desc" },
    include: {
      teacher: { select: { name: true } },
    },
  });
}

export async function getAnnouncementForCourse(courseId: string, announcementId: string) {
  return prisma.courseAnnouncement.findFirst({
    where: { id: announcementId, courseId },
    include: {
      teacher: { select: { name: true } },
    },
  });
}

export type CourseAnnouncementWithTeacher = CourseAnnouncement & {
  teacher: { name: string };
};
