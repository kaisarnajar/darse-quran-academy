import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/site/PageHeader";
import { Section } from "@/components/site/Section";
import { getPublishedTeacherById } from "@/lib/teachers";

type TeacherPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: TeacherPageProps): Promise<Metadata> {
  const { id } = await params;
  const teacher = await getPublishedTeacherById(id);
  if (!teacher) return { title: "Instructor not found" };
  return {
    title: teacher.name,
    description: teacher.specialization,
  };
}

export default async function TeacherPage({ params }: TeacherPageProps) {
  const { id } = await params;
  const teacher = await getPublishedTeacherById(id);
  if (!teacher) notFound();

  return (
    <Section>
      <Link href="/teachers" className="text-sm font-medium text-gold hover:underline">
        ← All teachers
      </Link>
      <div className="mx-auto mt-6 max-w-2xl">
        <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:gap-6 sm:text-left">
          {teacher.imageUrl ? (
            <img
              src={teacher.imageUrl}
              alt=""
              className="h-24 w-24 shrink-0 rounded-xl object-cover ring-2 ring-gold/30"
            />
          ) : (
            <span
              className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-teal-800 text-2xl font-bold text-white"
              aria-hidden
            >
              {teacher.initials}
            </span>
          )}
          <div className="mt-4 sm:mt-0">
            <PageHeader title={teacher.name} description={teacher.specialization} />
          </div>
        </div>
        <p className="mt-8 text-base leading-relaxed text-muted">{teacher.bio}</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/courses" className="btn-gold-solid inline-flex justify-center px-8 py-3 text-sm">
            View courses
          </Link>
          <Link href="/teachers" className="btn-gold-outline inline-flex justify-center px-8 py-3 text-sm">
            All instructors
          </Link>
        </div>
      </div>
    </Section>
  );
}
