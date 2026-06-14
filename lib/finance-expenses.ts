import { prisma } from "@/lib/prisma";
import type { FinanceFilters } from "@/lib/finance-filters";
import { financePaidAtWhere } from "@/lib/finance-filters";

const expenseInclude = {
  teacher: { select: { id: true, name: true } },
} as const;

function buildExpenseWhere(filters: FinanceFilters) {
  const paidAt = financePaidAtWhere(filters);

  return {
    ...(filters.category ? { category: filters.category } : {}),
    ...(filters.teacherId ? { teacherId: filters.teacherId } : {}),
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

export async function getExpenseTotal(filters: FinanceFilters): Promise<number> {
  const result = await prisma.expense.aggregate({
    where: buildExpenseWhere(filters),
    _sum: { amountInrPaise: true },
  });

  return result._sum.amountInrPaise ?? 0;
}
