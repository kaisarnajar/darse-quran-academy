import Link from "next/link";
import Image from "next/image";
import type { Teacher } from "@/lib/teachers";

type TeacherCardProps = {
  teacher: Teacher;
};

export function TeacherCard({ teacher }: TeacherCardProps) {
  const href = `/teachers/${teacher.id}`;

  return (
    <Link
      href={href}
      className="card-elevated flex flex-col items-center p-6 text-center transition-transform hover:-translate-y-0.5"
    >
      {teacher.imageUrl ? (
        <Image
          src={teacher.imageUrl}
          alt=""
          width={80}
          height={80}
          unoptimized
          className="h-20 w-20 rounded-xl object-cover ring-2 ring-accent-muted"
        />
      ) : (
        <span
          className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-800 text-xl font-bold text-white"
          aria-hidden
        >
          {teacher.initials}
        </span>
      )}
      <h3 className="mt-4 text-base font-semibold text-foreground sm:text-lg">{teacher.name}</h3>
      <p className="mt-1 text-sm font-medium text-gold">{teacher.specialization}</p>
      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{teacher.bio}</p>
      <span className="mt-4 text-xs font-semibold uppercase tracking-wide text-gold">View profile →</span>
    </Link>
  );
}
