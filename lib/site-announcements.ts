import type { SiteAnnouncement } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/** Maximum announcements featured on the homepage. */
export const HOMEPAGE_FEATURED_ANNOUNCEMENTS_MAX = 4;

/** @deprecated Use {@link HOMEPAGE_FEATURED_ANNOUNCEMENTS_MAX}. */
export const HOMEPAGE_SITE_ANNOUNCEMENT_LIMIT = HOMEPAGE_FEATURED_ANNOUNCEMENTS_MAX;

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
  limit = HOMEPAGE_FEATURED_ANNOUNCEMENTS_MAX,
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

export async function getFeaturedHomepageAnnouncementCount(): Promise<number> {
  return prisma.siteAnnouncement.count({
    where: { published: true, showOnHomepage: true },
  });
}

export async function resolveAnnouncementFeaturedUpdate(options: {
  published: boolean;
  requestFeatured: boolean;
  currentlyFeatured: boolean;
}): Promise<{ showOnHomepage: boolean } | { error: string }> {
  if (!options.published || !options.requestFeatured) {
    return { showOnHomepage: false };
  }

  if (options.currentlyFeatured) {
    return { showOnHomepage: true };
  }

  const featuredCount = await getFeaturedHomepageAnnouncementCount();
  if (featuredCount >= HOMEPAGE_FEATURED_ANNOUNCEMENTS_MAX) {
    return {
      error: `The homepage already has ${HOMEPAGE_FEATURED_ANNOUNCEMENTS_MAX} featured announcements. Remove one before adding another.`,
    };
  }

  return { showOnHomepage: true };
}

/** Keeps at most {@link HOMEPAGE_FEATURED_ANNOUNCEMENTS_MAX} published homepage announcements (newest). */
export async function enforceHomepageAnnouncementLimit() {
  const featured = await prisma.siteAnnouncement.findMany({
    where: { published: true, showOnHomepage: true },
    orderBy: { createdAt: "desc" },
    select: { id: true },
  });

  if (featured.length <= HOMEPAGE_FEATURED_ANNOUNCEMENTS_MAX) return;

  const demoteIds = featured
    .slice(HOMEPAGE_FEATURED_ANNOUNCEMENTS_MAX)
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
