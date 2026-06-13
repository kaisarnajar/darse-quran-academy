import Link from "next/link";
import { notFound } from "next/navigation";
import { CompleteAllStudentsButton } from "@/components/admin/CompleteAllStudentsButton";
import { CompleteCourseButton } from "@/components/admin/CompleteCourseButton";
import { SendCertificateButton } from "@/components/admin/SendCertificateButton";
import { ApproveEnrollmentButton } from "@/components/admin/ApproveEnrollmentButton";
import { RejectEnrollmentButton } from "@/components/admin/RejectEnrollmentButton";
import { AWAITING_ENROLLMENT_FEE, PENDING_ENROLLMENT_APPROVAL } from "@/lib/enrollment-status";
import { RemoveEnrollmentButton } from "@/components/admin/RemoveEnrollmentButton";
import { getCourseById } from "@/lib/courses";
import { enrollmentStatusClass, enrollmentStatusLabel, getEnrollmentsForCourse } from "@/lib/enrollments";

export default async function CourseStudentsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ completed?: string; rejected?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const [course, enrollments] = await Promise.all([getCourseById(id), getEnrollmentsForCourse(id)]);

  if (!course) notFound();

  const activeCount = enrollments.filter((e) => e.status === "active").length;
  const completedCount = enrollments.filter((e) => e.status === "completed").length;

  return (
    <div>
      <Link href="/admin/courses" className="text-sm text-primary hover:underline">
        ← Back to courses
      </Link>
      <Link href={`/admin/courses/${id}/edit`} className="ml-4 text-sm text-muted hover:text-primary">
        Edit course
      </Link>
      <Link href="/admin/enrollments" className="ml-4 text-sm text-primary hover:underline">
        Enrollment requests
      </Link>
      <Link href="/admin/payment-approvals" className="ml-4 text-sm text-primary hover:underline">
        Payment approvals
      </Link>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-primary">Students</h1>
          <p className="mt-1 text-sm text-muted">
            <span className="font-medium text-foreground">{course.title}</span>
            {" · "}
            {activeCount} active · {completedCount} completed · {enrollments.length} total
          </p>
        </div>
        <CompleteAllStudentsButton courseId={id} activeCount={activeCount} />
      </div>

      {query.completed === "1" && (
        <p className="mt-4 rounded-md bg-violet-50 px-4 py-3 text-sm text-violet-800">
          Students marked complete. Use &quot;Send certificate&quot; for each student when ready.
        </p>
      )}
      {query.rejected === "1" && (
        <p className="mt-4 rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Enrollment rejected. The student can request enrollment again from the course page.
        </p>
      )}

      <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-surface">
        {enrollments.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted">No students enrolled in this course yet.</p>
        ) : (
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-border bg-background/50 text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Completed</th>
                <th className="px-4 py-3 font-medium">Certificate email</th>
                <th className="min-w-[12rem] px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {enrollments.map((enrollment) => (
                <tr key={enrollment.id}>
                  <td className="px-4 py-3 font-medium text-foreground">
                    {enrollment.user.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-muted">{enrollment.user.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${enrollmentStatusClass(enrollment.status)}`}
                    >
                      {enrollmentStatusLabel(enrollment.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {enrollment.completedAt
                      ? enrollment.completedAt.toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">
                    {enrollment.certificateEmailSentAt
                      ? enrollment.certificateEmailSentAt.toLocaleDateString("en-IN")
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-right align-top">
                    <div className="flex flex-wrap items-start justify-end gap-2">
                      {enrollment.status === PENDING_ENROLLMENT_APPROVAL && (
                        <>
                          <ApproveEnrollmentButton enrollmentId={enrollment.id} courseId={id} />
                          <RejectEnrollmentButton enrollmentId={enrollment.id} courseId={id} />
                        </>
                      )}
                      {(enrollment.status === AWAITING_ENROLLMENT_FEE) && (
                        <RejectEnrollmentButton enrollmentId={enrollment.id} courseId={id} />
                      )}
                      {enrollment.status === "active" && (
                        <CompleteCourseButton enrollmentId={enrollment.id} courseId={id} />
                      )}
                      {enrollment.status === "completed" && (
                        <SendCertificateButton
                          enrollmentId={enrollment.id}
                          courseId={id}
                          certificateEmailSentAt={enrollment.certificateEmailSentAt}
                        />
                      )}
                      <RemoveEnrollmentButton
                        enrollmentId={enrollment.id}
                        courseId={id}
                        studentLabel={enrollment.user.name ?? enrollment.user.email}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
