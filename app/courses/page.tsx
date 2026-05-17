import type { Metadata } from "next";
import { CourseCard } from "@/components/CourseCard";
import { PageHeader } from "@/components/site/PageHeader";
import { Section } from "@/components/site/Section";
import { auth } from "@/lib/auth";
import { getPublishedCourses } from "@/lib/courses";
import { getEnrolledCourseIds } from "@/lib/enrollments";

export const metadata: Metadata = {
  title: "Courses",
  description: "View and enroll in upcoming courses at Darse Quran Academy.",
};

export default async function CoursesPage() {
  const session = await auth();
  const courses = await getPublishedCourses();
  const enrolledIds = session?.user?.id ? await getEnrolledCourseIds(session.user.id) : [];
  const enrolledSet = new Set(enrolledIds);

  return (
    <Section>
      <PageHeader
        title="Course Announcements"
        description="Browse programs and enroll online. Sign in to purchase a course."
      />
      <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {courses.length === 0 ? (
          <p className="col-span-full text-center text-muted">No courses available at the moment.</p>
        ) : (
          courses.map((course) => (
            <CourseCard key={course.id} course={course} isEnrolled={enrolledSet.has(course.id)} />
          ))
        )}
      </div>
    </Section>
  );
}
