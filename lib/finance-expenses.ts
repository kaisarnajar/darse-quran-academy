import { isTeacherExpenseFilterRelevant } from "@/lib/expense-categories";
import type { FinanceFilters } from "@/lib/finance-filters";
import { financePaidAtWhere } from "@/lib/finance-filters";
import { clampPage, paginationArgs, type PaginatedResult } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";

const expenseInclude = {
  teacher: { select: { id: true, name: true } },
} as const;

function buildExpenseWhere(filters: FinanceFilters) {
  const paidAt = financePaidAtWhere(filters);

  return {
    ...(filters.category ? { category: filters.category } : {}),
    ...(isTeacherExpenseFilterRelevant(filters.category) && filters.teacherId
      ? { teacherId: filters.teacherId }
      : {}),
    ...(paidAt ? { paidAt } : {}),
  };
}

export async function getExpenses(filters: FinanceFilters) {
  return prisma.expense.findMany({
    where: buildExpenseWhere(filters),
    include: expenseInclude,
    orderBy: { paidAt: "desc" },
  });
}

export async function getExpensesPaginated(
  filters: FinanceFilters,
  page: number,
  pageSize: number,
): Promise<PaginatedResult<Awaited<ReturnType<typeof getExpenses>>[number]>> {
  const where = buildExpenseWhere(filters);
  const totalCount = await prisma.expense.count({ where });
  const safePage = clampPage(page, totalCount, pageSize);
  const items = await prisma.expense.findMany({
    where,
    include: expenseInclude,
    orderBy: { paidAt: "desc" },
    ...paginationArgs(safePage, pageSize),
  });
  return { items, totalCount };
}

export async function getExpenseTotal(filters: FinanceFilters): Promise<number> {
  const result = await prisma.expense.aggregate({
    where: buildExpenseWhere(filters),
    _sum: { amountInrPaise: true },
  });

  return result._sum.amountInrPaise ?? 0;
}
