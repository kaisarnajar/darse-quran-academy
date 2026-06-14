"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-actions";
import {
  buildFinanceQueryString,
  parseFinanceFilters,
  type FinanceSearchParams,
} from "@/lib/finance-filters";
import { prisma } from "@/lib/prisma";

function revalidateFinancePaths() {
  revalidatePath("/admin/finance");
  revalidatePath("/admin");
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
  const query = buildFinanceQueryString(filters, { tab: "expenses", deleted: "1" });
  return { redirectTo: `/admin/finance${query}` };
}
