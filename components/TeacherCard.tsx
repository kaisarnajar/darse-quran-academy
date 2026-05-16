import type { Teacher } from "@/content/teachers";

type TeacherCardProps = {
  teacher: Teacher;
};

export function TeacherCard({ teacher }: TeacherCardProps) {
  return (
    <article className="flex flex-col items-center rounded-lg border border-border bg-surface p-4 text-center shadow-sm sm:p-6">
      <div
        className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-xl font-bold text-white"
        aria-hidden
      >
        {teacher.initials}
      </div>
      <h3 className="mt-4 font-serif text-base font-semibold text-foreground sm:text-lg">{teacher.name}</h3>
      <p className="mt-1 text-sm font-medium text-accent">{teacher.specialization}</p>
      <p className="mt-3 text-sm text-muted">{teacher.bio}</p>
    </article>
  );
}
