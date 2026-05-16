import type { Course } from "@/content/courses";

type CourseCardProps = {
  course: Course;
};

const levelColors: Record<Course["level"], string> = {
  Beginner: "bg-green-100 text-green-800",
  Intermediate: "bg-amber-100 text-amber-800",
  Advanced: "bg-red-100 text-red-800",
};

export function CourseCard({ course }: CourseCardProps) {
  return (
    <article className="flex flex-col rounded-lg border border-border bg-surface p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          {course.category}
        </span>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${levelColors[course.level]}`}>
          {course.level}
        </span>
      </div>
      <h3 className="font-serif text-lg font-semibold text-foreground">{course.title}</h3>
      <p className="mt-2 flex-1 text-sm text-muted">{course.description}</p>
      <p className="mt-4 text-sm font-medium text-primary">Starts: {course.startDate}</p>
      <button
        type="button"
        className="mt-4 w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-light"
      >
        View Details
      </button>
    </article>
  );
}
