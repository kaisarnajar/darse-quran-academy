import type { Metadata } from "next";
import Link from "next/link";
import { DownloadCertificateButton } from "@/components/certificate/DownloadCertificateButton";
import { PageHeader } from "@/components/site/PageHeader";
import { Section } from "@/components/site/Section";
import { auth } from "@/lib/auth";
import { isEnrollmentCertificateReady } from "@/lib/completion";
import { getCourseById, formatPrice } from "@/lib/courses";
import { getUserEnrollments } from "@/lib/enrollments";

export const metadata: Metadata = {
  title: "My Courses",
  description: "View your enrolled courses at Darse Quran Academy.",
};

function statusLabel(status: string) {
  if (status === "completed") return "Completed";
  if (status === "pending_verification") return "Awaiting payment verification";
  if (status === "pending") return "Payment pending";
  if (status === "active") return "Active";
  return status;
}

export default async function MyCoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ pending?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;

  if (!session?.user?.id) {
    return null;
  }

  const enrollments = await getUserEnrollments(session.user.id);

  const enrollmentRows = await Promise.all(
    enrollments.map(async (enrollment) => {
      const course = await getCourseById(enrollment.courseId);
      return { enrollment, course };
    }),
  );

  return (
    <Section>
      <PageHeader
        title="My Courses"
        description={`Welcome${session.user.name ? `, ${session.user.name}` : ""}! Here are your programs.`}
      />

      {params.pending === "1" && (
        <p className="mx-auto mt-6 max-w-2xl rounded-md bg-amber-50 px-4 py-3 text-center text-sm text-amber-900">
          Thank you! We received your UPI payment details and will verify them shortly. You will get access once
          confirmed.
        </p>
      )}

      {enrollments.length === 0 ? (
        <div className="mx-auto mt-10 max-w-md rounded-lg border border-border bg-surface p-6 text-center">
          <p className="text-muted">You have not enrolled in any courses yet.</p>
          <Link
            href="/courses"
            className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-light"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {enrollmentRows.map(({ enrollment, course }) => {
            if (!course) return null;
            const certificateReady = isEnrollmentCertificateReady(enrollment);

            return (
              <li key={enrollment.id} className="card-elevated flex flex-col p-5">
                <span className="w-fit rounded-full bg-accent-muted px-2.5 py-0.5 text-xs font-medium text-primary">
                  {statusLabel(enrollment.status)}
                </span>
                <h2 className="mt-2 font-serif text-lg font-semibold text-foreground">{course.title}</h2>
                <p className="mt-2 flex-1 text-sm text-muted">{course.description}</p>
                <p className="mt-3 text-sm text-primary">Starts: {course.startDate}</p>
                {enrollment.amountPaid != null && (
                  <p className="mt-1 text-sm font-medium text-foreground">
                    Paid: {formatPrice(enrollment.amountPaid)}
                  </p>
                )}
                {enrollment.status === "pending" && (
                  <Link
                    href={`/payment/${enrollment.id}`}
                    className="mt-4 flex min-h-11 items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary-light"
                  >
                    Complete UPI payment
                  </Link>
                )}
                {certificateReady && (
                  <DownloadCertificateButton enrollmentId={enrollment.id} courseTitle={course.title} />
                )}
                {enrollment.completedAt && (
                  <p className="mt-3 text-xs text-muted">
                    Completed {enrollment.completedAt.toLocaleDateString("en-IN")}
                  </p>
                )}
                {!certificateReady && enrollment.status !== "pending" && (
                  <p className="mt-4 text-xs text-muted">
                    Enrolled {enrollment.createdAt.toLocaleDateString("en-IN")}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </Section>
  );
}
