import { CourseEnrollButton } from "@/components/auth/CourseEnrollButton";
import type { Course } from "@/lib/courses";
import { formatPrice } from "@/lib/courses";

type CourseCardProps = {
  course: Course;
  isEnrolled?: boolean;
  enrollmentStatus?: string | null;
  enrollmentId?: string | null;
};

const levelColors: Record<string, string> = {
  Beginner: "bg-violet-100 text-violet-800",
  Intermediate: "bg-amber-100 text-amber-900",
  Advanced: "bg-stone-200 text-stone-800",
};

export function CourseCard({
  course,
  isEnrolled = false,
  enrollmentStatus = null,
  enrollmentId = null,
}: CourseCardProps) {
  const levelClass = levelColors[course.level] ?? "bg-slate-100 text-slate-800";

  return (
    <article className="card-elevated flex flex-col p-4 transition-transform hover:-translate-y-0.5 sm:p-6">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-semibold text-accent">
          {course.category}
        </span>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${levelClass}`}>
          {course.level}
        </span>
      </div>
      <h3 className="font-serif text-base font-semibold text-foreground sm:text-lg">{course.title}</h3>
      <p className="mt-2 flex-1 text-sm text-muted">{course.description}</p>
      <p className="mt-3 text-sm font-medium text-primary-light">Starts: {course.startDate}</p>
      <p className="mt-1 text-lg font-bold text-primary">{formatPrice(course.priceInrPaise)}</p>
      <CourseEnrollButton
        courseId={course.id}
        priceInrPaise={course.priceInrPaise}
        isEnrolled={isEnrolled}
        enrollmentStatus={enrollmentStatus}
        enrollmentId={enrollmentId}
      />
    </article>
  );
}
