import { prisma } from "@/lib/prisma";

export async function getPaymentRecordsForUser(userId: string) {
  return prisma.paymentRecord.findMany({
    where: { userId },
    orderBy: { paidAt: "desc" },
  });
}

export async function getPaymentSubmissionsForUser(userId: string) {
  return prisma.coursePaymentSubmission.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}
