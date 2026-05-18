import { prisma } from "@/lib/prisma";

export async function getPaymentRecordsForUser(userId: string) {
  return prisma.paymentRecord.findMany({
    where: { userId },
    orderBy: { paidAt: "desc" },
  });
}
