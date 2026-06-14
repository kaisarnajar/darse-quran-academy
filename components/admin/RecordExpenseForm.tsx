"use client";

import { useActionState, useState } from "react";
import { recordExpense, type RecordExpenseState } from "@/app/admin/finance/actions";
import {
  EXPENSE_CATEGORIES,
  expenseCategoryLabel,
  EXPENSE_CATEGORY_TEACHER_SALARY,
} from "@/lib/expense-categories";
import type { FinanceSearchParams } from "@/lib/finance-filters";
import { inputClassName, labelClassName } from "@/lib/form";

type RecordExpenseFormProps = {
  teachers: { id: string; name: string }[];
  returnQuery: FinanceSearchParams;
};

const initialState: RecordExpenseState = {};

export function RecordExpenseForm({ teachers, returnQuery }: RecordExpenseFormProps) {
  const boundAction = recordExpense.bind(null, returnQuery);
  const [state, formAction, pending] = useActionState(boundAction, initialState);
  const [category, setCategory] = useState<string>(EXPENSE_CATEGORIES[0]);
  const today = new Date().toISOString().slice(0, 10);

  const showTeacherField = category === EXPENSE_CATEGORY_TEACHER_SALARY;

  return (
    <form
      action={formAction}
      className="rounded-lg border border-border bg-surface p-4 sm:p-5"
    >
      <div className="border-b border-border pb-4">
        <h3 className="font-serif text-base font-semibold text-foreground">Record new expense</h3>
        <p className="mt-1 text-sm text-muted">
          Add a salary, hosting, or other operational cost to the ledger.
        </p>
      </div>

      {state.error && (
        <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {state.error}
        </p>
      )}

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="expense-category-input" className={labelClassName}>
            Category
          </label>
          <select
            id="expense-category-input"
            name="category"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputClassName}
          >
            {EXPENSE_CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {expenseCategoryLabel(item)}
              </option>
            ))}
          </select>
        </div>

        {showTeacherField && (
          <div>
            <label htmlFor="expense-teacher-input" className={labelClassName}>
              Teacher
            </label>
            <select
              id="expense-teacher-input"
              name="teacherId"
              required
              defaultValue=""
              className={inputClassName}
            >
              <option value="" disabled>
                Select teacher
              </option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label htmlFor="expense-amount" className={labelClassName}>
            Amount (₹)
          </label>
          <input
            id="expense-amount"
            name="amountInr"
            type="number"
            min="1"
            step="0.01"
            required
            placeholder="5000"
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="expense-paid-at" className={labelClassName}>
            Payment date
          </label>
          <input
            id="expense-paid-at"
            name="paidAt"
            type="date"
            required
            defaultValue={today}
            className={inputClassName}
          />
        </div>

        <div className="sm:col-span-2 lg:col-span-4">
          <label htmlFor="expense-description" className={labelClassName}>
            Description (optional)
          </label>
          <input
            id="expense-description"
            name="description"
            type="text"
            maxLength={500}
            placeholder="e.g. March salary, domain renewal"
            className={inputClassName}
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end border-t border-border pt-4">
        <button
          type="submit"
          disabled={pending}
          className="min-h-11 rounded-md bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-light disabled:opacity-60"
        >
          {pending ? "Saving…" : "Record expense"}
        </button>
      </div>
    </form>
  );
}
