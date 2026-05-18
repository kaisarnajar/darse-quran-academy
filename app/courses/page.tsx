import type { Metadata } from "next";
import { CourseCard } from "@/components/CourseCard";
import { PaymentDetailsPanel } from "@/components/payment/PaymentDetailsPanel";
import { PageHeader } from "@/components/site/PageHeader";
import { Section } from "@/components/site/Section";
import { auth } from "@/lib/auth";
import { getPublishedCourses } from "@/lib/courses";
import { getUserCourseEnrollmentMap } from "@/lib/enrollments";
import { isUserProfileComplete } from "@/lib/profile";

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
  const profileComplete = session?.user?.id
    ? await isUserProfileComplete(session.user.id)
    : true;

  return (
    <Section>
      <PageHeader
        title="Course Announcements"
        description="Browse programs, view fees by level, and pay the registration fee online."
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
                profileComplete={profileComplete}
              />
            );
          })
        )}
      </div>

      <div className="mx-auto mt-16 max-w-lg">
        <h2 className="font-serif text-xl font-semibold text-foreground sm:text-2xl">Payment details</h2>
        <p className="mt-2 text-sm text-muted">
          Pay the one-time registration fee by UPI or bank transfer. Enroll in a course first, then submit your
          transaction reference on the payment page—or use the details below and include your enrollment
          reference when you pay.
        </p>
        <div className="mt-6">
          <PaymentDetailsPanel />
        </div>
      </div>
    </Section>
  );
}
