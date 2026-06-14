import { FinanceDateFilter } from "@/components/admin/FinanceDateFilter";
import { FinanceExpenseFilters } from "@/components/admin/FinanceExpenseFilters";
import { FinanceExpenseTable } from "@/components/admin/FinanceExpenseTable";
import { FinanceFilteredSummary } from "@/components/admin/FinanceFilteredSummary";
import { FinanceIncomeFilters } from "@/components/admin/FinanceIncomeFilters";
import { FinanceIncomeTable } from "@/components/admin/FinanceIncomeTable";
import { FinanceSummaryCards } from "@/components/admin/FinanceSummaryCards";
import { FinanceTabs } from "@/components/admin/FinanceTabs";
import { RecordExpenseForm } from "@/components/admin/RecordExpenseForm";
import { getAllCourses } from "@/lib/courses";
import { getExpenses, getExpenseTotal } from "@/lib/finance-expenses";
import { parseFinanceFilters, type FinanceSearchParams } from "@/lib/finance-filters";
import { getIncomeRecords, getIncomeTotal } from "@/lib/finance-income";
import { getStudentUsers } from "@/lib/students";
import { getAllTeachers } from "@/lib/teachers";

export default async function AdminFinancePage({
  searchParams,
}: {
  searchParams: Promise<FinanceSearchParams>;
}) {
  const params = await searchParams;
  const filters = parseFinanceFilters(params);

  const dateOnlyFilters = {
    preset: filters.preset,
    from: filters.from,
    to: filters.to,
    tab: filters.tab,
  };

  const [
    incomeTotal,
    expenseTotal,
    incomeRecords,
    expenses,
    courses,
    students,
    teachers,
  ] = await Promise.all([
    getIncomeTotal(dateOnlyFilters),
    getExpenseTotal(dateOnlyFilters),
    getIncomeRecords(filters),
    getExpenses(filters),
    getAllCourses(),
    getStudentUsers(),
    getAllTeachers(),
  ]);

  const returnQuery = params;
  const filteredIncomeTotal = incomeRecords.reduce((sum, r) => sum + r.amountInrPaise, 0);
  const filteredExpenseTotal = expenses.reduce((sum, e) => sum + e.amountInrPaise, 0);

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-primary">Finance</h1>
      <p className="mt-1 text-sm text-muted">
        Track student fee income and academy expenses. Summary totals use the selected date range.
      </p>

      {params.saved === "1" && (
        <p className="mt-4 rounded-md bg-violet-50 px-4 py-3 text-sm text-violet-800">
          Expense recorded.
        </p>
      )}
      {params.deleted === "1" && (
        <p className="mt-4 rounded-md bg-violet-50 px-4 py-3 text-sm text-violet-800">
          Expense deleted.
        </p>
      )}
      {params.error && (
        <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {decodeURIComponent(params.error)}
        </p>
      )}

      <div className="mt-6">
        <FinanceDateFilter filters={filters} />
      </div>

      <div className="mt-6">
        <FinanceSummaryCards incomeTotal={incomeTotal} expenseTotal={expenseTotal} />
      </div>

      <div className="mt-8">
        <FinanceTabs filters={filters} />
      </div>

      {filters.tab === "income" ? (
        <section className="mt-6 space-y-4">
          <FinanceIncomeFilters
            filters={filters}
            courses={courses.map((c) => ({ id: c.id, title: c.title }))}
            students={students.map((s) => ({ id: s.id, name: s.name, email: s.email }))}
          />

          <FinanceFilteredSummary
            recordCount={incomeRecords.length}
            totalPaise={filteredIncomeTotal}
            variant="income"
          />

          <div className="overflow-x-auto rounded-lg border border-border bg-surface">
            <FinanceIncomeTable records={incomeRecords} />
          </div>
        </section>
      ) : (
        <section className="mt-6 space-y-4">
          <FinanceExpenseFilters
            filters={filters}
            teachers={teachers.map((t) => ({ id: t.id, name: t.name }))}
          />

          <FinanceFilteredSummary
            recordCount={expenses.length}
            totalPaise={filteredExpenseTotal}
            variant="expense"
          />

          <RecordExpenseForm
            teachers={teachers.map((t) => ({ id: t.id, name: t.name }))}
            returnQuery={returnQuery}
          />

          <div className="overflow-x-auto rounded-lg border border-border bg-surface">
            <FinanceExpenseTable expenses={expenses} returnQuery={returnQuery} />
          </div>
        </section>
      )}
    </div>
  );
}
