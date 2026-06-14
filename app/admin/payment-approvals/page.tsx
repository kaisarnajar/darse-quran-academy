import { PendingPaymentApprovalsTable } from "@/components/admin/PendingPaymentApprovalsTable";
import { Pagination } from "@/components/shared/Pagination";
import { getAllCourses } from "@/lib/courses";
import {
  getPendingEnrollmentFeePaymentsPaginated,
  getPendingMonthlyPaymentsPaginated,
} from "@/lib/monthly-payments";
import { APPROVAL_PAGE_SIZE, clampPage, parsePaginationParams } from "@/lib/pagination";

export default async function AdminPaymentApprovalsPage({
  searchParams,
}: {
  searchParams: Promise<{ confirmed?: string; declined?: string; page?: string; monthlyPage?: string }>;
}) {
  const params = await searchParams;
  const { page: enrollmentPage, pageSize: enrollmentPageSize } = parsePaginationParams(params, {
    pageSize: APPROVAL_PAGE_SIZE,
  });
  const { page: monthlyPage, pageSize: monthlyPageSize } = parsePaginationParams(params, {
    pageSize: APPROVAL_PAGE_SIZE,
    pageParam: "monthlyPage",
  });

  const [enrollmentFeesPaginated, monthlyFeesPaginated, courses] = await Promise.all([
    getPendingEnrollmentFeePaymentsPaginated(enrollmentPage, enrollmentPageSize),
    getPendingMonthlyPaymentsPaginated(monthlyPage, monthlyPageSize),
    getAllCourses(),
  ]);

  const pendingEnrollmentFees = enrollmentFeesPaginated.items;
  const pendingMonthlyFees = monthlyFeesPaginated.items;
  const enrollmentTotalCount = enrollmentFeesPaginated.totalCount;
  const monthlyTotalCount = monthlyFeesPaginated.totalCount;
  const safeEnrollmentPage = clampPage(enrollmentPage, enrollmentTotalCount, enrollmentPageSize);
  const safeMonthlyPage = clampPage(monthlyPage, monthlyTotalCount, monthlyPageSize);

  const titleById = new Map(courses.map((c) => [c.id, c.title]));

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-primary">Payment approvals</h1>
      <p className="mt-1 text-sm text-muted">
        Verify enrollment and monthly fee payments submitted by students. Free enrollment requests
        are managed under Enrollments.
      </p>
      {params.confirmed === "1" && (
        <p className="mt-4 rounded-md bg-violet-50 px-4 py-3 text-sm text-violet-800">
          Payment approved and recorded.
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
          {enrollmentTotalCount > 0 && (
            <span className="ml-2 inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-900">
              {enrollmentTotalCount}
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

        <Pagination
          basePath="/admin/payment-approvals"
          params={params}
          page={safeEnrollmentPage}
          totalCount={enrollmentTotalCount}
          pageSize={enrollmentPageSize}
        />
      </section>

      <section id="monthly-fees" className="mt-10 scroll-mt-6">
        <h2 className="font-serif text-lg font-semibold text-foreground">
          Monthly fee approvals
          {monthlyTotalCount > 0 && (
            <span className="ml-2 inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-900">
              {monthlyTotalCount}
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

        <Pagination
          basePath="/admin/payment-approvals"
          params={params}
          page={safeMonthlyPage}
          totalCount={monthlyTotalCount}
          pageSize={monthlyPageSize}
          pageParam="monthlyPage"
        />
      </section>
    </div>
  );
}
