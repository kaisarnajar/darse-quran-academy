import Link from "next/link";
import { notFound } from "next/navigation";
import { CompleteAllStudentsButton } from "@/components/admin/CompleteAllStudentsButton";
import { CompleteCourseButton } from "@/components/admin/CompleteCourseButton";
import { SendCertificateButton } from "@/components/admin/SendCertificateButton";
import { ApproveEnrollmentButton } from "@/components/admin/ApproveEnrollmentButton";
import { ConfirmPaymentButton } from "@/components/admin/ConfirmPaymentButton";
import { DeclinePaymentButton } from "@/components/admin/DeclinePaymentButton";
import { PENDING_ENROLLMENT_APPROVAL } from "@/lib/enrollment-status";
import { RemoveEnrollmentButton } from "@/components/admin/RemoveEnrollmentButton";
import { formatPrice, getCourseById } from "@/lib/courses";
import { getEnrollmentsForCourse } from "@/lib/enrollments";

function statusClass(status: string) {
  if (status === "completed") return "bg-emerald-100 text-emerald-900";
  if (status === "active") return "bg-violet-100 text-violet-800";
  if (status === "pending_verification") return "bg-amber-100 text-amber-900";
  if (status === "payment_declined") return "bg-red-100 text-red-900";
  if (status === "pending") return "bg-stone-200 text-stone-700";
  return "bg-stone-200 text-stone-700";
}

function statusLabel(status: string) {
  if (status === "pending_verification") return "Awaiting verification";
  if (status === "payment_declined") return "Payment declined — resubmit pending";
  if (status === "completed") return "Completed";
  return status.replace(/_/g, " ");
}

export default async function CourseStudentsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ completed?: string; confirmed?: string; declined?: string }>;
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
        All pending payments
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
      {query.confirmed === "1" && (
        <p className="mt-4 rounded-md bg-violet-50 px-4 py-3 text-sm text-violet-800">
          Payment confirmed. This student now has active access to the course.
        </p>
      )}
      {query.declined === "1" && (
        <p className="mt-4 rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Payment declined. The student can submit payment again from their profile.
        </p>
      )}

      <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-surface">
        {enrollments.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted">No students enrolled in this course yet.</p>
        ) : (
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="border-b border-border bg-background/50 text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">UPI UTR</th>
                <th className="px-4 py-3 font-medium">Paid</th>
                <th className="px-4 py-3 font-medium">Completed</th>
                <th className="px-4 py-3 font-medium">Certificate email</th>
                <th className="px-4 py-3 font-medium" />
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
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusClass(enrollment.status)}`}
                    >
                      {statusLabel(enrollment.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">
                    {enrollment.upiTransactionId ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {enrollment.amountPaid != null ? formatPrice(enrollment.amountPaid) : "—"}
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
                  <td className="px-4 py-3 text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      {enrollment.status === PENDING_ENROLLMENT_APPROVAL && (
                        <ApproveEnrollmentButton enrollmentId={enrollment.id} courseId={id} />
                      )}
                      {enrollment.status === "pending_verification" && (
                        <>
                          <ConfirmPaymentButton enrollmentId={enrollment.id} courseId={id} />
                          <DeclinePaymentButton enrollmentId={enrollment.id} courseId={id} />
                        </>
                      )}
                      {enrollment.status === "pending" && (
                        <ApproveEnrollmentButton enrollmentId={enrollment.id} courseId={id} />
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
