import Link from "next/link";
import type { Teacher } from "@prisma/client";

type CourseTeacherInfoProps = {
  teacher: Teacher | null;
  compact?: boolean;
};

export function CourseTeacherInfo({ teacher, compact = false }: CourseTeacherInfoProps) {
  if (!teacher) {
    return <p className="mt-4 text-sm text-muted">Instructor to be announced.</p>;
  }

  const href = `/teachers/${teacher.id}`;

  if (compact) {
    return (
      <p className="mt-3 text-sm text-muted">
        <span className="font-medium text-foreground">Instructor:</span>{" "}
        <Link href={href} className="font-medium text-gold hover:underline">
          {teacher.name}
        </Link>
        <span className="text-muted"> · {teacher.specialization}</span>
      </p>
    );
  }

  return (
    <Link
      href={href}
      className="mt-4 block rounded-lg border border-border bg-background/40 p-3 transition-colors hover:border-gold/40 hover:bg-accent-muted/30"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-gold">Instructor</p>
      <div className="mt-2 flex items-center gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-800 text-sm font-bold text-white"
          aria-hidden
        >
          {teacher.initials}
        </span>
        <div>
          <p className="font-semibold leading-snug text-foreground">{teacher.name}</p>
          <p className="mt-0.5 text-sm font-medium text-gold">{teacher.specialization}</p>
        </div>
      </div>
    </Link>
  );
}
