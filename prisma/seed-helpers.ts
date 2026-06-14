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

const demoCourseStatuses: Record<string, CourseStatus> = {
  "qiraat-advanced": "COMPLETED",
  "islamic-history": "ON_HOLD",
  "children-nazira": "DRAFT",
  "hifz-foundation": "ONGOING",
};

export function seedCourseStatus(courseId: string): CourseStatus {
  return demoCourseStatuses[courseId] ?? "PUBLISHED";
}
