import type { Metadata } from "next";
import { TeacherCard } from "@/components/TeacherCard";
import { Section } from "@/components/site/Section";
import { teachers } from "@/content/teachers";

export const metadata: Metadata = {
  title: "Teachers",
  description: "Meet the qualified scholars and instructors at Darse Quran Academy.",
};

export default function TeachersPage() {
  return (
    <Section>
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-serif text-3xl font-bold text-primary sm:text-4xl">Our Teachers</h1>
        <p className="mt-4 text-muted">
          Learn from experienced scholars dedicated to authentic Islamic education in the tradition of
          Deoband.
        </p>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {teachers.map((teacher) => (
          <TeacherCard key={teacher.id} teacher={teacher} />
        ))}
      </div>
    </Section>
  );
}
