import type { CourseStatus } from "@prisma/client";
import { courseStatusBadgeClass, courseStatusLabel } from "@/lib/course-status";

export function CourseStatusPill({ status }: { status: CourseStatus }) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${courseStatusBadgeClass(status)}`}
    >
      {courseStatusLabel(status)}
    </span>
  );
}
