import type { Metadata } from "next";
import { TeacherCard } from "@/components/TeacherCard";
import { PageHeader } from "@/components/site/PageHeader";
import { Section } from "@/components/site/Section";
import { getPublishedTeachers } from "@/lib/teachers";

export const metadata: Metadata = {
  title: "Teachers",
  description: "Meet the qualified scholars and instructors at Darse Quran Academy.",
};

export default async function TeachersPage() {
  const teachers = await getPublishedTeachers();

  return (
    <Section>
      <PageHeader
        title="Our Teachers"
        description="Learn from experienced scholars dedicated to authentic Islamic education in the tradition of Deoband."
      />
      <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {teachers.length === 0 ? (
          <p className="col-span-full text-center text-muted">No teachers listed yet.</p>
        ) : (
          teachers.map((teacher) => <TeacherCard key={teacher.id} teacher={teacher} />)
        )}
      </div>
    </Section>
  );
}
