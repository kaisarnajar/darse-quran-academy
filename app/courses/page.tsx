import type { Metadata } from "next";
import { CourseCard } from "@/components/CourseCard";
import { PageHeader } from "@/components/site/PageHeader";
import { Section } from "@/components/site/Section";
import { courses } from "@/content/courses";

export const metadata: Metadata = {
  title: "Courses",
  description: "View upcoming course announcements at Darse Quran Academy.",
};

export default function CoursesPage() {
  return (
    <Section>
      <PageHeader
        title="Course Announcements"
        description="Browse our current and upcoming programs. Registration details will be shared soon for each course."
      />
      <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </Section>
  );
}
