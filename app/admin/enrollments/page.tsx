import Link from "next/link";
import { AdminEnrollUserForm } from "@/components/admin/AdminEnrollUserForm";
import { ApproveEnrollmentButton } from "@/components/admin/ApproveEnrollmentButton";
import { RejectEnrollmentButton } from "@/components/admin/RejectEnrollmentButton";
import { isCourseEnrollmentOpen } from "@/lib/course-status";
import { getAllCourses } from "@/lib/courses";
import {
  getAwaitingEnrollmentFeeEnrollments,
  getPendingFreeEnrollmentApprovals,
  type PendingEnrollmentWithUser,
} from "@/lib/enrollments";

function EnrollmentRequestsTable({
  enrollments,
  courseTitleById,
  emptyMessage,
  showApprove,
}: {
  enrollments: PendingEnrollmentWithUser[];
  courseTitleById: Map<string, string>;
  emptyMessage: string;
  showApprove: boolean;
}) {
  if (enrollments.length === 0) {
    return <p className="px-4 py-8 text-center text-sm text-muted">{emptyMessage}</p>;
  }

  return (
    <table className="w-full min-w-[720px] text-left text-sm">
      <thead className="border-b border-border bg-background/50 text-muted">
        <tr>
          <th className="px-4 py-3 font-medium">Student</th>
          <th className="px-4 py-3 font-medium">Course</th>
          <th className="px-4 py-3 font-medium">Requested</th>
          <th className="px-4 py-3 font-medium" />
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {enrollments.map((enrollment) => (
          <tr key={enrollment.id}>
            <td className="px-4 py-3">
              <p className="font-medium text-foreground">{enrollment.user.name ?? "—"}</p>
              <p className="text-xs text-muted">{enrollment.user.email}</p>
            </td>
            <td className="px-4 py-3 text-foreground">
              {courseTitleById.get(enrollment.courseId) ?? enrollment.courseId}
            </td>
            <td className="px-4 py-3 text-muted">
              {enrollment.createdAt.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </td>
            <td className="px-4 py-3 text-right">
              <div className="flex flex-wrap justify-end gap-2">
                {showApprove && (
                  <ApproveEnrollmentButton
                    enrollmentId={enrollment.id}
                    courseId={enrollment.courseId}
                  />
                )}
                <RejectEnrollmentButton
                  enrollmentId={enrollment.id}
                  courseId={enrollment.courseId}
                />
                <Link
                  href={`/admin/students/${enrollment.user.id}`}
                  className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent-muted/50"
                >
                  Student profile
                </Link>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default async function AdminEnrollmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ approved?: string; rejected?: string }>;
}) {
  const params = await searchParams;
  const [freeEnrollmentRequests, awaitingEnrollmentFee, courses] = await Promise.all([
    getPendingFreeEnrollmentApprovals(),
    getAwaitingEnrollmentFeeEnrollments(),
    getAllCourses(),
  ]);

  const titleById = new Map(courses.map((c) => [c.id, c.title]));
  const enrollableCourses = courses.filter((c) => isCourseEnrollmentOpen(c.status));

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-primary">Course enrollments</h1>
      <p className="mt-1 text-sm text-muted">
        Approve free enrollment requests here. Paid courses are activated after you verify the
        enrollment fee under{" "}
        <Link href="/admin/payment-approvals#enrollment-fees" className="font-medium text-primary hover:underline">
          Payment approvals
        </Link>
        .
      </p>

      {params.approved === "1" && (
        <p className="mt-4 rounded-md bg-violet-50 px-4 py-3 text-sm text-violet-800">
          Enrollment approved. The student now has access to the course.
        </p>
      )}
      {params.rejected === "1" && (
        <p className="mt-4 rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Enrollment rejected. The student can request enrollment again from the course page.
        </p>
      )}

      <section className="mt-8">
        <h2 className="font-serif text-lg font-semibold text-foreground">
          Free enrollment requests
          {freeEnrollmentRequests.length > 0 && (
            <span className="ml-2 inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-900">
              {freeEnrollmentRequests.length}
            </span>
          )}
        </h2>
        <p className="mt-1 text-sm text-muted">
          Courses with no enrollment fee. Approve to grant access immediately.
        </p>

        <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-surface">
          <EnrollmentRequestsTable
            enrollments={freeEnrollmentRequests}
            courseTitleById={titleById}
            emptyMessage="No free enrollment requests awaiting approval."
            showApprove
          />
        </div>
      </section>

      <section className="mt-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="font-serif text-lg font-semibold text-foreground">
              Paid courses — awaiting enrollment fee
              {awaitingEnrollmentFee.length > 0 && (
                <span className="ml-2 inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-900">
                  {awaitingEnrollmentFee.length}
                </span>
              )}
            </h2>
            <p className="mt-1 text-sm text-muted">
              Students must pay the enrollment fee first. Once they submit payment, verify it under
              enrollment fee approvals — approving payment activates the enrollment automatically.
            </p>
          </div>
          <Link
            href="/admin/payment-approvals#enrollment-fees"
            className="inline-flex shrink-0 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
          >
            Go to enrollment fee approvals
          </Link>
        </div>

        <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-surface">
          <EnrollmentRequestsTable
            enrollments={awaitingEnrollmentFee}
            courseTitleById={titleById}
            emptyMessage="No paid enrollments awaiting student payment."
            showApprove={false}
          />
        </div>
      </section>

      <section className="mt-10">
        <AdminEnrollUserForm courses={enrollableCourses} />
      </section>
    </div>
  );
}
