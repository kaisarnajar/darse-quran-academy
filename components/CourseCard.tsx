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
  Beginner: "bg-amber-100 text-amber-900",
  Intermediate: "bg-stone-200 text-stone-800",
  Advanced: "bg-teal-100 text-teal-900",
};

const categoryGradients: Record<string, string> = {
  Quran: "from-teal-800 to-teal-600",
  Tajweed: "from-amber-800 to-amber-600",
  Arabic: "from-slate-700 to-slate-500",
  Islamic: "from-emerald-800 to-emerald-600",
  default: "from-stone-700 to-stone-500",
};

function courseBannerClass(category: string) {
  const key = Object.keys(categoryGradients).find((k) =>
    category.toLowerCase().includes(k.toLowerCase()),
  );
  return categoryGradients[key ?? "default"];
}

export function CourseCard({
  course,
  isEnrolled = false,
  enrollmentStatus = null,
  enrollmentId = null,
}: CourseCardProps) {
  const levelClass = levelColors[course.level] ?? "bg-slate-100 text-slate-800";

  return (
    <article className="card-elevated flex flex-col overflow-hidden p-0 transition-transform hover:-translate-y-0.5">
      <div
        className={`flex h-32 items-center justify-center bg-gradient-to-br ${courseBannerClass(course.category)} text-white`}
      >
        <span className="text-3xl font-bold opacity-30" aria-hidden>
          {course.category.charAt(0)}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-gold">
            {course.category}
          </span>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${levelClass}`}>
            {course.level}
          </span>
        </div>
        <h3 className="text-lg font-bold text-foreground">{course.title}</h3>
        <p className="mt-2 flex-1 text-sm text-muted">{course.description}</p>
        <p className="mt-3 text-sm text-muted">Starts: {course.startDate}</p>
        <p className="mt-1 text-lg font-bold text-gold">{formatPrice(course.priceInrPaise)}</p>
        <CourseEnrollButton
          courseId={course.id}
          priceInrPaise={course.priceInrPaise}
          isEnrolled={isEnrolled}
          enrollmentStatus={enrollmentStatus}
          enrollmentId={enrollmentId}
        />
      </div>
    </article>
  );
}
