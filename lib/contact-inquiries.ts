import { prisma } from "@/lib/prisma";
import { clampPage, paginationArgs, type PaginatedResult } from "@/lib/pagination";

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

function contactInquiryWhere(filter?: ContactInquiryFilter) {
  return filter === "pending"
    ? { reply: null }
    : filter === "replied"
      ? { reply: { not: null } }
      : undefined;
}

const contactInquiryInclude = {
  repliedBy: { select: { id: true, name: true, email: true } },
} as const;

export async function getAllContactInquiriesPaginated(
  page: number,
  pageSize: number,
  filter?: ContactInquiryFilter,
) {
  const where = contactInquiryWhere(filter);
  const totalCount = await prisma.contactInquiry.count({ where });
  const safePage = clampPage(page, totalCount, pageSize);
  const items = await prisma.contactInquiry.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: contactInquiryInclude,
    ...paginationArgs(safePage, pageSize),
  });
  return { items, totalCount };
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
