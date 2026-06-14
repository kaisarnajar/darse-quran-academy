"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth-actions";
import { EXPENSE_CATEGORY_TEACHER_SALARY } from "@/lib/expense-categories";
import {
  buildFinanceQueryString,
  parseFinanceFilters,
  type FinanceSearchParams,
} from "@/lib/finance-filters";
import { rupeesToPaise } from "@/lib/form";
import { prisma } from "@/lib/prisma";
import { expenseSchema } from "@/lib/validations";

export type RecordExpenseState = {
  error?: string;
};

function revalidateFinancePaths() {
  revalidatePath("/admin/finance");
  revalidatePath("/admin");
}

function financeRedirect(params: FinanceSearchParams, event: "saved" | "deleted") {
  const filters = parseFinanceFilters(params);
  const query = buildFinanceQueryString(filters, {
    saved: event === "saved" ? "1" : undefined,
    deleted: event === "deleted" ? "1" : undefined,
  });
  redirect(`/admin/finance${query}`);
}

export async function recordExpense(
  returnQuery: FinanceSearchParams,
  _prev: RecordExpenseState,
  formData: FormData,
): Promise<RecordExpenseState> {
  await requireAdmin();

  const parsed = expenseSchema.safeParse({
    category: formData.get("category"),
    amountInr: formData.get("amountInr"),
    paidAt: formData.get("paidAt"),
    description: formData.get("description") || undefined,
    teacherId: formData.get("teacherId") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid expense data." };
  }

  const paidAt = new Date(parsed.data.paidAt);
  if (Number.isNaN(paidAt.getTime())) {
    return { error: "Invalid payment date." };
  }

  const teacherId =
    parsed.data.category === EXPENSE_CATEGORY_TEACHER_SALARY
      ? parsed.data.teacherId?.trim() || null
      : null;

  if (teacherId) {
    const teacher = await prisma.teacher.findUnique({ where: { id: teacherId } });
    if (!teacher) {
      return { error: "Teacher not found." };
    }
  }

  await prisma.expense.create({
    data: {
      category: parsed.data.category,
      amountInrPaise: rupeesToPaise(parsed.data.amountInr),
      paidAt,
      description: parsed.data.description?.trim() || null,
      teacherId,
    },
  });

  revalidateFinancePaths();
  financeRedirect(returnQuery, "saved");
}

export async function deleteExpenseById(
  id: string,
  returnQuery: FinanceSearchParams = {},
): Promise<{ error?: string; redirectTo?: string }> {
  await requireAdmin();

  const expense = await prisma.expense.findUnique({ where: { id } });
  if (!expense) {
    return { error: "Expense not found." };
  }

  await prisma.expense.delete({ where: { id } });

  revalidateFinancePaths();

  const filters = parseFinanceFilters(returnQuery);
  const query = buildFinanceQueryString(filters, { deleted: "1" });
  return { redirectTo: `/admin/finance${query}` };
}
