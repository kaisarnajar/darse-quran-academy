import Link from "next/link";
import { AdminEnrollUserForm } from "@/components/admin/AdminEnrollUserForm";
import { ApproveEnrollmentButton } from "@/components/admin/ApproveEnrollmentButton";
import { RejectEnrollmentButton } from "@/components/admin/RejectEnrollmentButton";
import { isCourseEnrollmentOpen } from "@/lib/course-status";
import { getAllCourses } from "@/lib/courses";
import { PENDING_ENROLLMENT_APPROVAL } from "@/lib/enrollment-status";
import { enrollmentStatusLabel, getPendingEnrollmentApprovals } from "@/lib/enrollments";

export default async function AdminEnrollmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ approved?: string; rejected?: string }>;
}) {
  const params = await searchParams;
  const [pendingApprovals, courses] = await Promise.all([
    getPendingEnrollmentApprovals(),
    getAllCourses(),
  ]);

  const titleById = new Map(courses.map((c) => [c.id, c.title]));
  const enrollableCourses = courses.filter((c) => isCourseEnrollmentOpen(c.status));

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-primary">Course enrollments</h1>
      <p className="mt-1 text-sm text-muted">
        Approve free enrollment requests and manage paid enrollments awaiting student payment.
        Enrollment and monthly fee payments are approved under{" "}
        <Link href="/admin/payment-approvals" className="font-medium text-primary hover:underline">
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
          Pending enrollment requests
          {pendingApprovals.length > 0 && (
            <span className="ml-2 inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-900">
              {pendingApprovals.length}
            </span>
          )}
        </h2>
        <p className="mt-1 text-sm text-muted">
          Free courses await your approval. Paid courses appear here until the student pays the
          enrollment fee; payment verification activates enrollment automatically.
        </p>

        <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-surface">
          {pendingApprovals.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted">No enrollment requests awaiting approval.</p>
          ) : (
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-border bg-background/50 text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Student</th>
                  <th className="px-4 py-3 font-medium">Course</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Requested</th>
                  <th className="px-4 py-3 font-medium" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pendingApprovals.map((enrollment) => (
                  <tr key={enrollment.id}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{enrollment.user.name ?? "—"}</p>
                      <p className="text-xs text-muted">{enrollment.user.email}</p>
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {titleById.get(enrollment.courseId) ?? enrollment.courseId}
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {enrollmentStatusLabel(enrollment.status)}
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
                        {enrollment.status === PENDING_ENROLLMENT_APPROVAL && (
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
          )}
        </div>
      </section>

      <section className="mt-10">
        <AdminEnrollUserForm courses={enrollableCourses} />
      </section>
    </div>
  );
}
