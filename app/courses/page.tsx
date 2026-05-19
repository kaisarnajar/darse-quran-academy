import type { Metadata } from "next";
import { CourseCard } from "@/components/CourseCard";
import { CoursesPageNav } from "@/components/courses/CoursesPageNav";
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

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const showPayment = tab === "payment";

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
        description={
          showPayment
            ? "UPI and bank details for registration payments. Enroll in a course first, then use your payment reference on the checkout page."
            : "Browse programs and enroll online."
        }
      />

      <CoursesPageNav active={showPayment ? "payment" : "courses"} />

      {showPayment ? (
        <div className="mx-auto mt-8 max-w-5xl">
          <PaymentDetailsPanel />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
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
      )}
    </Section>
  );
}
