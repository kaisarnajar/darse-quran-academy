import { prisma } from "@/lib/prisma";
import type { FinanceFilters } from "@/lib/finance-filters";
import { financePaidAtWhere } from "@/lib/finance-filters";

const incomeInclude = {
  user: { select: { id: true, name: true, email: true } },
  course: { select: { id: true, title: true } },
} as const;

function buildIncomeWhere(filters: FinanceFilters) {
  const paidAt = financePaidAtWhere(filters);

  return {
    ...(filters.courseId ? { courseId: filters.courseId } : {}),
    ...(filters.studentId ? { userId: filters.studentId } : {}),
    ...(filters.paymentType ? { paymentType: filters.paymentType } : {}),
    ...(paidAt ? { paidAt } : {}),
  };
}

export async function getIncomeRecords(filters: FinanceFilters) {
  return prisma.paymentRecord.findMany({
    where: buildIncomeWhere(filters),
    include: incomeInclude,
    orderBy: { paidAt: "desc" },
  });
}

export async function getIncomeTotal(filters: FinanceFilters): Promise<number> {
  const result = await prisma.paymentRecord.aggregate({
    where: buildIncomeWhere(filters),
    _sum: { amountInrPaise: true },
  });

  return result._sum.amountInrPaise ?? 0;
}
