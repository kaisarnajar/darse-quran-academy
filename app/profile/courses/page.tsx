import Link from "next/link";
import { CourseDurationDisplay } from "@/components/courses/CourseDurationDisplay";
import { requireUser } from "@/lib/auth-actions";
import { getCourseById } from "@/lib/courses";
import {
  AWAITING_ENROLLMENT_FEE,
  PENDING_ENROLLMENT_APPROVAL,
} from "@/lib/enrollment-status";
import { enrollmentStatusLabel, getUserEnrollments } from "@/lib/enrollments";
import { getPendingEnrollmentFeeSubmissionMap } from "@/lib/monthly-payments";

export default async function ProfileCoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ declined?: string }>;
}) {
  const session = await requireUser();
  const params = await searchParams;
  const [enrollments, pendingEnrollmentPayments] = await Promise.all([
    getUserEnrollments(session.user.id),
    getPendingEnrollmentFeeSubmissionMap(session.user.id),
  ]);

  const enrollmentRows = await Promise.all(
    enrollments.map(async (enrollment) => {
      const course = await getCourseById(enrollment.courseId);
      return { enrollment, course };
    }),
  );

  return (
    <div>
      <h2 className="font-serif text-lg font-semibold text-foreground">My Courses</h2>
      <p className="mt-1 text-sm text-muted">
        {session.user.name ? `Welcome, ${session.user.name}. ` : ""}
        Enrolled programs and monthly fee payments appear below.
      </p>

      {params.declined === "1" && (
        <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-900">
          Your previous payment was declined. Use the payment link below to submit again.
        </p>
      )}

      {enrollments.length === 0 ? (
        <div className="mt-6 rounded-lg border border-border bg-surface p-6 text-center">
          <p className="text-muted">You have not enrolled in any courses yet.</p>
          <Link
            href="/courses"
            className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-light"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {enrollmentRows.map(({ enrollment, course }) => {
            if (!course) return null;
            const isActive = enrollment.status === "active" || enrollment.status === "completed";
            const awaitingEnrollmentFee = enrollment.status === AWAITING_ENROLLMENT_FEE;
            const hasPendingEnrollmentPayment = pendingEnrollmentPayments.has(course.id);

            return (
              <li key={enrollment.id} className="card-elevated flex flex-col p-5">
                <span className="w-fit rounded-full bg-accent-muted px-2.5 py-0.5 text-xs font-medium text-primary">
                  {awaitingEnrollmentFee && hasPendingEnrollmentPayment
                    ? "Awaiting payment verification"
                    : enrollmentStatusLabel(enrollment.status)}
                </span>
                <h3 className="mt-2 font-serif text-lg font-semibold text-foreground">{course.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted">{course.description}</p>
                <p className="mt-3 text-sm text-primary">Starts: {course.startDate}</p>
                <CourseDurationDisplay duration={course.duration} className="mt-1 text-primary/80" />

                {awaitingEnrollmentFee && (
                  <Link
                    href={
                      hasPendingEnrollmentPayment
                        ? "/profile/payments"
                        : `/profile/courses/${course.id}/enrollment-pay`
                    }
                    className="mt-4 flex min-h-11 items-center justify-center rounded-full border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900 hover:bg-amber-100"
                  >
                    {hasPendingEnrollmentPayment ? "Awaiting payment verification" : "Pay enrollment fee"}
                  </Link>
                )}

                {enrollment.status === PENDING_ENROLLMENT_APPROVAL && (
                  <p className="mt-4 text-sm text-amber-900">Awaiting enrollment approval by the academy.</p>
                )}

                {isActive && enrollment.status === "active" && (
                  <Link
                    href={`/profile/courses/${course.id}/pay`}
                    className="mt-4 flex min-h-11 items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary-light"
                  >
                    Pay monthly fee
                  </Link>
                )}

                <Link
                  href={`/profile/courses/${course.id}/announcements`}
                  className="mt-3 flex min-h-11 items-center justify-center rounded-full border border-border bg-surface px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent-muted/30"
                >
                  Course announcements
                </Link>

                {enrollment.completedAt && (
                  <p className="mt-3 text-xs text-muted">
                    Completed {enrollment.completedAt.toLocaleDateString("en-IN")}
                  </p>
                )}

                {!isActive && !awaitingEnrollmentFee && enrollment.status !== PENDING_ENROLLMENT_APPROVAL && (
                  <p className="mt-4 text-xs text-muted">
                    Requested {enrollment.createdAt.toLocaleDateString("en-IN")}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
