import type { CourseStatus } from "@prisma/client";

export const COURSE_STATUS_OPTIONS: {
  value: CourseStatus;
  label: string;
  description: string;
}[] = [
  { value: "DRAFT", label: "Draft", description: "Hidden from the public site" },
  { value: "PUBLISHED", label: "Published", description: "Listed and open for enrollment" },
  { value: "ONGOING", label: "Ongoing", description: "Course in progress; enrollment open" },
  { value: "ON_HOLD", label: "On hold", description: "Listed; new enrollments paused" },
  { value: "COMPLETED", label: "Completed", description: "Course finished; no new enrollments" },
];

export function courseStatusLabel(status: CourseStatus): string {
  return COURSE_STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status;
}

export function courseStatusBadgeClass(status: CourseStatus): string {
  switch (status) {
    case "DRAFT":
      return "bg-stone-200 text-stone-700";
    case "PUBLISHED":
      return "bg-violet-100 text-violet-800";
    case "ONGOING":
      return "bg-emerald-100 text-emerald-900";
    case "COMPLETED":
      return "bg-slate-200 text-slate-800";
    case "ON_HOLD":
      return "bg-amber-100 text-amber-900";
    default:
      return "bg-stone-200 text-stone-700";
  }
}

export function isCoursePubliclyVisible(status: CourseStatus): boolean {
  return status !== "DRAFT";
}

export function isCourseEnrollmentOpen(status: CourseStatus): boolean {
  return status === "PUBLISHED" || status === "ONGOING";
}

export function getCourseEnrollmentClosedMessage(status: CourseStatus): string | null {
  if (isCourseEnrollmentOpen(status)) return null;
  switch (status) {
    case "DRAFT":
      return "This course is not available.";
    case "ON_HOLD":
      return "Enrollment is temporarily on hold for this course.";
    case "COMPLETED":
      return "This course has completed. New enrollments are closed.";
    default:
      return "Enrollment is not available for this course.";
  }
}
