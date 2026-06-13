import type { SiteAnnouncement } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/** Maximum announcements shown in the homepage section. */
export const HOMEPAGE_SITE_ANNOUNCEMENT_LIMIT = 4;

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

export async function getHomepageSiteAnnouncements(
  limit = HOMEPAGE_SITE_ANNOUNCEMENT_LIMIT,
) {
  return prisma.siteAnnouncement.findMany({
    where: { published: true, showOnHomepage: true },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      createdBy: { select: { name: true } },
    },
  });
}

/** Keeps at most {@link HOMEPAGE_SITE_ANNOUNCEMENT_LIMIT} published homepage announcements (newest). */
export async function enforceHomepageAnnouncementLimit() {
  const featured = await prisma.siteAnnouncement.findMany({
    where: { published: true, showOnHomepage: true },
    orderBy: { createdAt: "desc" },
    select: { id: true },
  });

  if (featured.length <= HOMEPAGE_SITE_ANNOUNCEMENT_LIMIT) return;

  const demoteIds = featured
    .slice(HOMEPAGE_SITE_ANNOUNCEMENT_LIMIT)
    .map((announcement) => announcement.id);

  await prisma.siteAnnouncement.updateMany({
    where: { id: { in: demoteIds } },
    data: { showOnHomepage: false },
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
