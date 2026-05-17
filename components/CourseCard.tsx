import { CourseEnrollButton } from "@/components/auth/CourseEnrollButton";
import type { Course } from "@/lib/courses";
import { formatPrice } from "@/lib/courses";

type CourseCardProps = {
  course: Course;
  isEnrolled?: boolean;
};

const levelColors: Record<string, string> = {
  Beginner: "bg-green-100 text-green-800",
  Intermediate: "bg-amber-100 text-amber-800",
  Advanced: "bg-red-100 text-red-800",
};

export function CourseCard({ course, isEnrolled = false }: CourseCardProps) {
  const levelClass = levelColors[course.level] ?? "bg-gray-100 text-gray-800";

  return (
    <article className="flex flex-col rounded-lg border border-border bg-surface p-4 shadow-sm transition-shadow hover:shadow-md sm:p-6">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          {course.category}
        </span>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${levelClass}`}>
          {course.level}
        </span>
      </div>
      <h3 className="font-serif text-base font-semibold text-foreground sm:text-lg">{course.title}</h3>
      <p className="mt-2 flex-1 text-sm text-muted">{course.description}</p>
      <p className="mt-3 text-sm font-medium text-primary">Starts: {course.startDate}</p>
      <p className="mt-1 text-lg font-bold text-foreground">{formatPrice(course.priceInrPaise)}</p>
      <CourseEnrollButton
        courseId={course.id}
        priceInrPaise={course.priceInrPaise}
        isEnrolled={isEnrolled}
      />
    </article>
  );
}
