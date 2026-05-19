import type { SiteAnnouncement } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type SiteAnnouncementPublic = SiteAnnouncement & {
  createdBy: { name: string | null } | null;
};

export function formatSiteAnnouncementDate(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function getPublishedSiteAnnouncements(limit?: number) {
  return prisma.siteAnnouncement.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      createdBy: { select: { name: true } },
    },
  });
}

export async function getHomepageSiteAnnouncements(limit = 4) {
  return prisma.siteAnnouncement.findMany({
    where: { published: true, showOnHomepage: true },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      createdBy: { select: { name: true } },
    },
  });
}

export async function getSiteAnnouncementById(id: string) {
  return prisma.siteAnnouncement.findFirst({
    where: { id, published: true },
    include: {
      createdBy: { select: { name: true } },
    },
  });
}

export async function getAllSiteAnnouncementsForAdmin() {
  return prisma.siteAnnouncement.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      createdBy: { select: { name: true, email: true } },
    },
  });
}

export async function getSiteAnnouncementForAdmin(id: string) {
  return prisma.siteAnnouncement.findUnique({
    where: { id },
    include: {
      createdBy: { select: { name: true, email: true } },
    },
  });
}
