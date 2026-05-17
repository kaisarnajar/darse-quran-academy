import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/site/PageHeader";
import { Section } from "@/components/site/Section";
import { auth } from "@/lib/auth";
import { getCourseById, formatPrice } from "@/lib/courses";
import { getUserEnrollments } from "@/lib/enrollments";

export const metadata: Metadata = {
  title: "My Courses",
  description: "View your enrolled courses at Darse Quran Academy.",
};

export default async function MyCoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;

  if (!session?.user?.id) {
    return null;
  }

  const enrollments = await getUserEnrollments(session.user.id);

  return (
    <Section>
      <PageHeader
        title="My Courses"
        description={`Welcome${session.user.name ? `, ${session.user.name}` : ""}! Here are your enrolled programs.`}
      />

      {params.success === "1" && (
        <p className="mx-auto mt-6 max-w-2xl rounded-md bg-green-50 px-4 py-3 text-center text-sm text-green-800">
          Payment successful. Your enrollment is now active.
        </p>
      )}

      {enrollments.length === 0 ? (
        <div className="mx-auto mt-10 max-w-md rounded-lg border border-border bg-surface p-6 text-center">
          <p className="text-muted">You have not enrolled in any courses yet.</p>
          <Link
            href="/courses"
            className="mt-4 inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-light"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {enrollments.map((enrollment) => {
            const course = getCourseById(enrollment.courseId);
            if (!course) return null;

            return (
              <li
                key={enrollment.id}
                className="rounded-lg border border-border bg-surface p-5 shadow-sm"
              >
                <span className="text-xs font-medium uppercase tracking-wide text-accent">
                  {enrollment.status}
                </span>
                <h2 className="mt-2 font-serif text-lg font-semibold text-foreground">{course.title}</h2>
                <p className="mt-2 text-sm text-muted">{course.description}</p>
                <p className="mt-3 text-sm text-primary">Starts: {course.startDate}</p>
                {enrollment.amountPaid != null && (
                  <p className="mt-1 text-sm font-medium text-foreground">
                    Paid: {formatPrice(enrollment.amountPaid)}
                  </p>
                )}
                <p className="mt-4 text-xs text-muted">
                  Enrolled {enrollment.createdAt.toLocaleDateString("en-IN")}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </Section>
  );
}
