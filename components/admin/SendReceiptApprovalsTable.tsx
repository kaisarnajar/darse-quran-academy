import { SendReceiptButton } from "@/components/admin/SendReceiptButton";
import { formatPrice } from "@/lib/courses";
import type { ApprovedPaymentWithRecord } from "@/lib/monthly-payments";

type SendReceiptApprovalsTableProps = {
  submissions: ApprovedPaymentWithRecord[];
  courseTitleById: Map<string, string>;
  emptyMessage: string;
};

export function SendReceiptApprovalsTable({
  submissions,
  courseTitleById,
  emptyMessage,
}: SendReceiptApprovalsTableProps) {
  if (submissions.length === 0) {
    return (
      <p className="px-4 py-8 text-center text-sm text-muted">{emptyMessage}</p>
    );
  }

  return (
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
        {submissions.map((submission) => (
          <tr key={submission.id}>
            <td className="px-4 py-3">
              <p className="font-medium text-foreground">{submission.user.name ?? "—"}</p>
              <p className="text-xs text-muted">{submission.user.email}</p>
            </td>
            <td className="px-4 py-3 text-foreground">
              {courseTitleById.get(submission.courseId) ?? submission.courseId}
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
  );
}
