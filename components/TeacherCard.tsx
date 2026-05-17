import type { Teacher } from "@/lib/teachers";

type TeacherCardProps = {
  teacher: Teacher;
};

export function TeacherCard({ teacher }: TeacherCardProps) {
  return (
    <article className="card-elevated flex flex-col items-center p-6 text-center">
      {teacher.imageUrl ? (
        <img
          src={teacher.imageUrl}
          alt=""
          className="h-20 w-20 rounded-xl object-cover ring-2 ring-accent-muted"
        />
      ) : (
        <div
          className="flex h-20 w-20 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-xl font-bold text-white"
          aria-hidden
        >
          {teacher.initials}
        </div>
      )}
      <h3 className="mt-4 font-serif text-base font-semibold text-foreground sm:text-lg">{teacher.name}</h3>
      <p className="mt-1 text-sm font-medium text-accent">{teacher.specialization}</p>
      <p className="mt-3 text-sm leading-relaxed text-muted">{teacher.bio}</p>
    </article>
  );
}
