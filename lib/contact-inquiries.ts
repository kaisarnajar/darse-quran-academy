import { prisma } from "@/lib/prisma";

export type ContactInquiryFilter = "pending" | "replied" | undefined;

export async function getAllContactInquiries(filter?: ContactInquiryFilter) {
  return prisma.contactInquiry.findMany({
    where:
      filter === "pending"
        ? { reply: null }
        : filter === "replied"
          ? { reply: { not: null } }
          : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      repliedBy: { select: { id: true, name: true, email: true } },
    },
  });
}

export async function getContactInquiryById(id: string) {
  return prisma.contactInquiry.findUnique({
    where: { id },
    include: {
      repliedBy: { select: { id: true, name: true, email: true } },
    },
  });
}

export async function getPendingContactInquiryCount() {
  return prisma.contactInquiry.count({ where: { reply: null } });
}

export function normalizeContactPhone(phone: string) {
  return phone.replace(/\D/g, "");
}
