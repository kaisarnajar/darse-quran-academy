import type { Metadata } from "next";
import { CourseCard } from "@/components/CourseCard";
import { Section } from "@/components/site/Section";
import { courses } from "@/content/courses";

export const metadata: Metadata = {
  title: "Courses",
  description: "View upcoming course announcements at Darse Quran Academy.",
};

export default function CoursesPage() {
  return (
    <Section>
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-serif text-3xl font-bold text-primary sm:text-4xl">Course Announcements</h1>
        <p className="mt-4 text-muted">
          Browse our current and upcoming programs. Registration details will be shared soon for each
          course.
        </p>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </Section>
  );
}
