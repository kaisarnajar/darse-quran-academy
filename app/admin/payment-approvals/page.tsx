import Image from "next/image";
import Link from "next/link";
import { ConfirmMonthlyPaymentButton } from "@/components/admin/ConfirmMonthlyPaymentButton";
import { DeclineMonthlyPaymentButton } from "@/components/admin/DeclineMonthlyPaymentButton";
import { SendReceiptButton } from "@/components/admin/SendReceiptButton";
import { formatPrice, getAllCourses } from "@/lib/courses";
import {
  getApprovedMonthlyPaymentsForReceipt,
  getPendingMonthlyPayments,
} from "@/lib/monthly-payments";
import { monthlyPaymentStatusLabel } from "@/lib/monthly-payment-status";

export default async function AdminPaymentApprovalsPage({
  searchParams,
}: {
  searchParams: Promise<{ confirmed?: string; declined?: string }>;
}) {
  const params = await searchParams;
  const [pendingPayments, approvedPayments, courses] = await Promise.all([
    getPendingMonthlyPayments(),
    getApprovedMonthlyPaymentsForReceipt(),
    getAllCourses(),
  ]);

  const titleById = new Map(courses.map((c) => [c.id, c.title]));

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-primary">Payment approvals</h1>
      <p className="mt-1 text-sm text-muted">
        Verify monthly fee payments submitted by students. Course enrollment requests are managed under{" "}
        <Link href="/admin/enrollments" className="font-medium text-primary hover:underline">
          Enrollments
        </Link>
        .
      </p>

      {params.confirmed === "1" && (
        <p className="mt-4 rounded-md bg-violet-50 px-4 py-3 text-sm text-violet-800">
          Payment approved and recorded. Use &quot;Generate receipt&quot; or &quot;Upload receipt&quot; below
          when you are ready to send the student their receipt.
        </p>
      )}
      {params.declined === "1" && (
        <p className="mt-4 rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Payment declined. The student has been notified and can resubmit.
        </p>
      )}

      <section className="mt-8">
        <h2 className="font-serif text-lg font-semibold text-foreground">
          Pending monthly payments
          {pendingPayments.length > 0 && (
            <span className="ml-2 inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-900">
              {pendingPayments.length}
            </span>
          )}
        </h2>

        <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-surface">
          {pendingPayments.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted">No payments awaiting verification.</p>
          ) : (
            <table className="w-full min-w-[1020px] text-left text-sm">
              <thead className="border-b border-border bg-background/50 text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Student</th>
                  <th className="px-4 py-3 font-medium">Course</th>
                  <th className="px-4 py-3 font-medium">Fee period</th>
                  <th className="px-4 py-3 font-medium">Method</th>
                  <th className="px-4 py-3 font-medium">Reference</th>
                  <th className="px-4 py-3 font-medium">Screenshot</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Submitted</th>
                  <th className="px-4 py-3 font-medium" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pendingPayments.map((submission) => (
                  <tr key={submission.id}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{submission.user.name ?? "—"}</p>
                      <p className="text-xs text-muted">{submission.user.email}</p>
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {titleById.get(submission.courseId) ?? submission.courseId}
                    </td>
                    <td className="px-4 py-3 text-foreground">{submission.label}</td>
                    <td className="px-4 py-3 capitalize text-muted">
                      {submission.paymentMethod ?? "—"}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted">
                      {submission.upiTransactionId ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      {submission.paymentScreenshotPath ? (
                        <a
                          href={submission.paymentScreenshotPath}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Image
                            src={submission.paymentScreenshotPath}
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
                      {formatPrice(submission.amountInrPaise)}
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {submission.updatedAt.toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex flex-wrap justify-end gap-2">
                        <ConfirmMonthlyPaymentButton submissionId={submission.id} />
                        <DeclineMonthlyPaymentButton submissionId={submission.id} />
                        <Link
                          href={`/admin/students/${submission.user.id}`}
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
        <h2 className="font-serif text-lg font-semibold text-foreground">Send receipts</h2>
        <p className="mt-1 text-sm text-muted">
          Approved payments — generate or upload a PDF receipt and email the student a download link.
        </p>

        <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-surface">
          {approvedPayments.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted">No approved payments yet.</p>
          ) : (
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b border-border bg-background/50 text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Student</th>
                  <th className="px-4 py-3 font-medium">Course</th>
                  <th className="px-4 py-3 font-medium">Fee period</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Receipt email</th>
                  <th className="min-w-[12rem] px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {approvedPayments.map((submission) => (
                  <tr key={submission.id}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{submission.user.name ?? "—"}</p>
                      <p className="text-xs text-muted">{submission.user.email}</p>
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {titleById.get(submission.courseId) ?? submission.courseId}
                    </td>
                    <td className="px-4 py-3 text-muted">{submission.label}</td>
                    <td className="px-4 py-3 text-muted">
                      {formatPrice(submission.amountInrPaise)}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted">
                      {submission.receiptEmailSentAt
                        ? submission.receiptEmailSentAt.toLocaleDateString("en-IN")
                        : "—"}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <SendReceiptButton
                        paymentRecordId={submission.paymentRecordId}
                        receiptEmailSentAt={submission.receiptEmailSentAt}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
