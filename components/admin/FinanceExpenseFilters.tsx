import { EXPENSE_CATEGORIES, expenseCategoryLabel } from "@/lib/expense-categories";
import type { FinanceFilters } from "@/lib/finance-filters";

type FinanceExpenseFiltersProps = {
  filters: FinanceFilters;
  teachers: { id: string; name: string }[];
};

function preserveFields(filters: FinanceFilters) {
  const fields: { name: string; value: string }[] = [];

  if (filters.preset !== "this_month") {
    fields.push({ name: "preset", value: filters.preset });
  }
  if (filters.from) {
    fields.push({ name: "from", value: filters.from.toISOString().slice(0, 10) });
  }
  if (filters.to) {
    fields.push({ name: "to", value: filters.to.toISOString().slice(0, 10) });
  }
  if (filters.courseId) fields.push({ name: "courseId", value: filters.courseId });
  if (filters.studentId) fields.push({ name: "studentId", value: filters.studentId });
  if (filters.paymentType) fields.push({ name: "paymentType", value: filters.paymentType });
  fields.push({ name: "tab", value: "expenses" });

  return fields;
}

export function FinanceExpenseFilters({ filters, teachers }: FinanceExpenseFiltersProps) {
  return (
    <form
      method="get"
      action="/admin/finance"
      className="flex flex-wrap items-end gap-3 rounded-lg border border-border bg-surface p-4"
    >
      {preserveFields(filters).map((field) => (
        <input key={field.name} type="hidden" name={field.name} value={field.value} />
      ))}

      <div className="min-w-[160px]">
        <label htmlFor="expense-category" className="block text-xs font-medium text-muted">
          Category
        </label>
        <select
          id="expense-category"
          name="category"
          defaultValue={filters.category ?? ""}
          className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="">All categories</option>
          {EXPENSE_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {expenseCategoryLabel(category)}
            </option>
          ))}
        </select>
      </div>

      <div className="min-w-[160px]">
        <label htmlFor="expense-teacher" className="block text-xs font-medium text-muted">
          Teacher
        </label>
        <select
          id="expense-teacher"
          name="teacherId"
          defaultValue={filters.teacherId ?? ""}
          className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="">All teachers</option>
          {teachers.map((teacher) => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-accent-muted/50"
      >
        Filter expenses
      </button>
    </form>
  );
}
