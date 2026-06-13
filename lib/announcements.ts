import type { AnnouncementCategory, CourseAnnouncement, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const ANNOUNCEMENT_MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

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

const announcementInclude = {
  teacher: { select: { name: true } },
  enrollment: {
    select: {
      user: { select: { name: true, email: true } },
    },
  },
} satisfies Prisma.CourseAnnouncementInclude;

export function formatAnnouncementDate(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getAnnouncementAuthorName(announcement: {
  authorName: string;
  teacher: { name: string } | null;
}): string {
  return announcement.authorName.trim() || announcement.teacher?.name || "Academy";
}

export function getAnnouncementRecipientLabel(announcement: {
  enrollmentId: string | null;
  enrollment: { user: { name: string | null; email: string } } | null;
}): string | null {
  if (!announcement.enrollmentId) return null;
  const student = announcement.enrollment?.user;
  return student?.name?.trim() || student?.email || "Student";
}

/** Course-wide posts visible to all enrolled students. */
export async function getCourseWideAnnouncementsForCourse(courseId: string) {
  return prisma.courseAnnouncement.findMany({
    where: { courseId, enrollmentId: null },
    orderBy: { createdAt: "desc" },
    include: announcementInclude,
  });
}

/** Private posts for one student in a course. */
export async function getStudentAnnouncementsForEnrollment(enrollmentId: string) {
  return prisma.courseAnnouncement.findMany({
    where: { enrollmentId },
    orderBy: { createdAt: "desc" },
    include: announcementInclude,
  });
}

/** Course-wide plus this student's private posts. */
export async function getAnnouncementsVisibleToStudent(userId: string, courseId: string) {
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
    select: { id: true },
  });
  if (!enrollment) return { courseWide: [], personal: [] as Awaited<ReturnType<typeof getStudentAnnouncementsForEnrollment>> };

  const [courseWide, personal] = await Promise.all([
    getCourseWideAnnouncementsForCourse(courseId),
    getStudentAnnouncementsForEnrollment(enrollment.id),
  ]);

  return { courseWide, personal };
}

export async function getAnnouncementForCourse(
  courseId: string,
  announcementId: string,
  options?: { enrollmentId?: string | null },
) {
  return prisma.courseAnnouncement.findFirst({
    where: {
      id: announcementId,
      courseId,
      ...(options?.enrollmentId !== undefined ? { enrollmentId: options.enrollmentId } : {}),
    },
    include: announcementInclude,
  });
}

export function canTeacherManageCourseAnnouncement(
  announcement: Pick<CourseAnnouncement, "teacherId" | "postedByAdmin">,
  teacherId: string,
): boolean {
  return !announcement.postedByAdmin && announcement.teacherId === teacherId;
}

export type CourseAnnouncementWithTeacher = CourseAnnouncement & {
  teacher: { name: string } | null;
  enrollment: { user: { name: string | null; email: string } } | null;
};
