import Link from "next/link";
import { PendingPaymentApprovalsTable } from "@/components/admin/PendingPaymentApprovalsTable";
import { SendReceiptApprovalsTable } from "@/components/admin/SendReceiptApprovalsTable";
import { getAllCourses } from "@/lib/courses";
import {
  getApprovedMonthlyPaymentsForReceipt,
  getPendingEnrollmentFeePayments,
  getPendingMonthlyPayments,
} from "@/lib/monthly-payments";
import {
  PAYMENT_TYPE_ENROLLMENT,
  PAYMENT_TYPE_MONTHLY,
} from "@/lib/monthly-payment-status";

export default async function AdminPaymentApprovalsPage({
  searchParams,
}: {
  searchParams: Promise<{ confirmed?: string; declined?: string }>;
}) {
  const params = await searchParams;
  const [pendingEnrollmentFees, pendingMonthlyFees, approvedPayments, courses] = await Promise.all([
    getPendingEnrollmentFeePayments(),
    getPendingMonthlyPayments(),
    getApprovedMonthlyPaymentsForReceipt(),
    getAllCourses(),
  ]);

  const titleById = new Map(courses.map((c) => [c.id, c.title]));
  const approvedEnrollmentFees = approvedPayments.filter(
    (submission) => submission.paymentType === PAYMENT_TYPE_ENROLLMENT,
  );
  const approvedMonthlyFees = approvedPayments.filter(
    (submission) => submission.paymentType === PAYMENT_TYPE_MONTHLY,
  );

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-primary">Payment approvals</h1>
      <p className="mt-1 text-sm text-muted">
        Verify enrollment and monthly fee payments submitted by students. Free enrollment requests
        are managed under{" "}
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

      <section id="enrollment-fees" className="mt-8 scroll-mt-6">
        <h2 className="font-serif text-lg font-semibold text-foreground">
          Enrollment fee approvals
          {pendingEnrollmentFees.length > 0 && (
            <span className="ml-2 inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-900">
              {pendingEnrollmentFees.length}
            </span>
          )}
        </h2>
        <p className="mt-1 text-sm text-muted">
          Approve to activate the student&apos;s enrollment in the paid course.
        </p>

        <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-surface">
          <PendingPaymentApprovalsTable
            submissions={pendingEnrollmentFees}
            courseTitleById={titleById}
            emptyMessage="No enrollment fee payments awaiting verification."
          />
        </div>
      </section>

      <section id="monthly-fees" className="mt-10 scroll-mt-6">
        <h2 className="font-serif text-lg font-semibold text-foreground">
          Monthly fee approvals
          {pendingMonthlyFees.length > 0 && (
            <span className="ml-2 inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-900">
              {pendingMonthlyFees.length}
            </span>
          )}
        </h2>
        <p className="mt-1 text-sm text-muted">
          Verify monthly fee payments from active enrollments.
        </p>

        <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-surface">
          <PendingPaymentApprovalsTable
            submissions={pendingMonthlyFees}
            courseTitleById={titleById}
            emptyMessage="No monthly fee payments awaiting verification."
          />
        </div>
      </section>

      <section id="enrollment-fee-receipts" className="mt-10 scroll-mt-6">
        <h2 className="font-serif text-lg font-semibold text-foreground">Enrollment fee receipts</h2>
        <p className="mt-1 text-sm text-muted">
          Approved enrollment fee payments — generate or upload a PDF receipt and email the student.
        </p>

        <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-surface">
          <SendReceiptApprovalsTable
            submissions={approvedEnrollmentFees}
            courseTitleById={titleById}
            emptyMessage="No approved enrollment fee payments yet."
          />
        </div>
      </section>

      <section id="monthly-fee-receipts" className="mt-10 scroll-mt-6">
        <h2 className="font-serif text-lg font-semibold text-foreground">Monthly fee receipts</h2>
        <p className="mt-1 text-sm text-muted">
          Approved monthly fee payments — generate or upload a PDF receipt and email the student.
        </p>

        <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-surface">
          <SendReceiptApprovalsTable
            submissions={approvedMonthlyFees}
            courseTitleById={titleById}
            emptyMessage="No approved monthly fee payments yet."
          />
        </div>
      </section>
    </div>
  );
}
