import type { CourseStatus } from "@prisma/client";

export function demoStudentUserId(studentId: string) {
  return `seed-demo-user-${studentId}`;
}

export function demoStudentEmail(studentId: string) {
  return `demo-student-${studentId}@seed.local`;
}

export function demoTeacherUserId(teacherId: string) {
  return `seed-demo-teacher-user-${teacherId}`;
}

/** `index` is 0-based from ADMIN_EMAIL list. */
export function demoAdminUserId(index: number) {
  return `seed-demo-admin-user-${index + 1}`;
}

export function demoEnrollmentId(studentId: string, courseId: string) {
  return `seed-demo-enrollment-${studentId}-${courseId}`;
}

/** Normalize legacy month-year labels to YYYY-MM-DD for course date inputs. */
export function seedCourseStartDate(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.toLowerCase() === "ongoing") {
    return "Ongoing";
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  const monthMap: Record<string, string> = {
    january: "01",
    february: "02",
    march: "03",
    april: "04",
    may: "05",
    june: "06",
    july: "07",
    august: "08",
    september: "09",
    october: "10",
    november: "11",
    december: "12",
  };

  const match = trimmed.match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (match) {
    const month = monthMap[match[1].toLowerCase()];
    if (month) {
      return `${match[2]}-${month}-01`;
    }
  }

  return trimmed;
}

const demoCourseStatuses: Record<string, CourseStatus> = {
  "qiraat-advanced": "COMPLETED",
  "islamic-history": "ON_HOLD",
  "children-nazira": "DRAFT",
  "hifz-foundation": "ONGOING",
};

export function seedCourseStatus(courseId: string): CourseStatus {
  return demoCourseStatuses[courseId] ?? "PUBLISHED";
}
