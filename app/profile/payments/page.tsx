import { formatPrice, getAllCourses } from "@/lib/courses";
import { requireUser } from "@/lib/auth-actions";
import { getPaymentRecordsForUser } from "@/lib/payments";

export default async function ProfilePaymentsPage() {
  const session = await requireUser();
  const [payments, courses] = await Promise.all([
    getPaymentRecordsForUser(session.user.id),
    getAllCourses(),
  ]);

  const titleById = new Map(courses.map((c) => [c.id, c.title]));

  return (
    <div>
      <h2 className="font-serif text-lg font-semibold text-foreground">Payment history</h2>
      <p className="mt-1 text-sm text-muted">
        Payments recorded by the academy (registration fees, monthly fees, and other entries).
      </p>

      <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-surface">
        {payments.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted">No payments recorded yet.</p>
        ) : (
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-border bg-background/50 text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Course</th>
                <th className="px-4 py-3 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-4 py-3 text-muted">
                    {payment.paidAt.toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">
                    {formatPrice(payment.amountInrPaise)}
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    {payment.courseId
                      ? (titleById.get(payment.courseId) ?? payment.courseId)
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-muted">{payment.description ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
