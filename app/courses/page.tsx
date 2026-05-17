import type { Metadata } from "next";
import { CourseCard } from "@/components/CourseCard";
import { PageHeader } from "@/components/site/PageHeader";
import { Section } from "@/components/site/Section";
import { auth } from "@/lib/auth";
import { getPublishedCourses } from "@/lib/courses";
import { getUserCourseEnrollmentMap } from "@/lib/enrollments";

export const metadata: Metadata = {
  title: "Courses",
  description: "View and enroll in upcoming courses at Darse Quran Academy.",
};

export default async function CoursesPage() {
  const session = await auth();
  const courses = await getPublishedCourses();
  const enrollmentMap = session?.user?.id
    ? await getUserCourseEnrollmentMap(session.user.id)
    : new Map();

  return (
    <Section>
      <PageHeader
        title="Course Announcements"
        description="Browse programs and pay securely with UPI (Google Pay, PhonePe, Paytm)."
      />
      <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {courses.length === 0 ? (
          <p className="col-span-full text-center text-muted">No courses available at the moment.</p>
        ) : (
          courses.map((course) => {
            const enrollment = enrollmentMap.get(course.id);
            return (
              <CourseCard
                key={course.id}
                course={course}
                isEnrolled={enrollment?.status === "active" || enrollment?.status === "completed"}
                enrollmentStatus={enrollment?.status ?? null}
                enrollmentId={enrollment?.id ?? null}
              />
            );
          })
        )}
      </div>
    </Section>
  );
}
