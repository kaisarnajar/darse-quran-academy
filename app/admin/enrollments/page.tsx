import Image from "next/image";
import Link from "next/link";
import { AdminEnrollUserForm } from "@/components/admin/AdminEnrollUserForm";
import { ConfirmPaymentButton } from "@/components/admin/ConfirmPaymentButton";
import { DeclinePaymentButton } from "@/components/admin/DeclinePaymentButton";
import { isCourseEnrollmentOpen } from "@/lib/course-status";
import { formatPrice, getAllCourses } from "@/lib/courses";
import { getPendingPaymentEnrollments } from "@/lib/enrollments";

function statusLabel(status: string) {
  if (status === "pending_verification") return "Awaiting verification";
  if (status === "pending") return "Payment not submitted";
  return status.replace(/_/g, " ");
}

export default async function AdminEnrollmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ confirmed?: string; declined?: string }>;
}) {
  const params = await searchParams;
  const [pendingEnrollments, courses] = await Promise.all([
    getPendingPaymentEnrollments(),
    getAllCourses(),
  ]);

  const titleById = new Map(courses.map((c) => [c.id, c.title]));
  const enrollableCourses = courses.filter((c) => isCourseEnrollmentOpen(c.status));

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-primary">Enrollments & payments</h1>
      <p className="mt-1 text-sm text-muted">
        Verify UPI and bank transfer payments and manually enroll students in any course.
      </p>

      {params.confirmed === "1" && (
        <p className="mt-4 rounded-md bg-violet-50 px-4 py-3 text-sm text-violet-800">
          Payment confirmed. The student now has active access to the course.
        </p>
      )}
      {params.declined === "1" && (
        <p className="mt-4 rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Payment declined. The student has been notified by email and can resubmit payment from
          their profile.
        </p>
      )}

      <section className="mt-8">
        <h2 className="font-serif text-lg font-semibold text-foreground">
          Pending payments
          {pendingEnrollments.length > 0 && (
            <span className="ml-2 inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-900">
              {pendingEnrollments.length}
            </span>
          )}
        </h2>
        <p className="mt-1 text-sm text-muted">
          Only students who have submitted payment details for verification appear here. Declined
          payments are removed until the student resubmits.
        </p>

        <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-surface">
          {pendingEnrollments.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted">No payments awaiting verification.</p>
          ) : (
            <table className="w-full min-w-[1020px] text-left text-sm">
              <thead className="border-b border-border bg-background/50 text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Student</th>
                  <th className="px-4 py-3 font-medium">Course</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Method</th>
                  <th className="px-4 py-3 font-medium">Reference</th>
                  <th className="px-4 py-3 font-medium">Screenshot</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Submitted</th>
                  <th className="px-4 py-3 font-medium" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pendingEnrollments.map((enrollment) => (
                  <tr key={enrollment.id}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{enrollment.user.name ?? "—"}</p>
                      <p className="text-xs text-muted">{enrollment.user.email}</p>
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {titleById.get(enrollment.courseId) ?? enrollment.courseId}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-900">
                        {statusLabel(enrollment.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 capitalize text-muted">
                      {enrollment.paymentMethod ?? "—"}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted">
                      {enrollment.upiTransactionId ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      {enrollment.paymentScreenshotPath ? (
                        <a
                          href={enrollment.paymentScreenshotPath}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block"
                        >
                          <Image
                            src={enrollment.paymentScreenshotPath}
                            alt="Payment screenshot"
                            width={64}
                            height={64}
                            className="h-14 w-14 rounded border border-border object-cover"
                            unoptimized
                          />
                        </a>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {enrollment.amountPaid != null
                        ? formatPrice(enrollment.amountPaid)
                        : titleById.has(enrollment.courseId)
                          ? formatPrice(
                              courses.find((c) => c.id === enrollment.courseId)?.priceInrPaise ?? 0,
                            )
                          : "—"}
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {enrollment.updatedAt.toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex flex-wrap justify-end gap-2">
                        <ConfirmPaymentButton
                          enrollmentId={enrollment.id}
                          courseId={enrollment.courseId}
                        />
                        <DeclinePaymentButton
                          enrollmentId={enrollment.id}
                          courseId={enrollment.courseId}
                        />
                        <Link
                          href={`/admin/courses/${enrollment.courseId}/students`}
                          className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent-muted/50"
                        >
                          View course
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
