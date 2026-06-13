import type { LibraryItem as PrismaLibraryItem } from "@prisma/client";
import { isLibraryTopic } from "@/lib/library-options";
import { resolveHomepageFeaturedUpdate } from "@/lib/homepage-featured";
import { prisma } from "@/lib/prisma";

export const HOMEPAGE_FEATURED_RESOURCES_MAX = 4;

export type LibraryItem = PrismaLibraryItem;

export async function getPublishedLibraryItems(topic?: string): Promise<LibraryItem[]> {
  return prisma.libraryItem.findMany({
    where: {
      published: true,
      ...(topic && isLibraryTopic(topic) ? { topic } : {}),
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getFeaturedHomepageLibraryItems(): Promise<LibraryItem[]> {
  const items = await prisma.libraryItem.findMany({
    where: { featuredOnHomepage: true, published: true },
    orderBy: [{ featuredAt: "desc" }, { updatedAt: "desc" }],
    take: HOMEPAGE_FEATURED_RESOURCES_MAX,
  });
  return items;
}

export async function getFeaturedHomepageLibraryCount(): Promise<number> {
  return prisma.libraryItem.count({
    where: { featuredOnHomepage: true, published: true },
  });
}

export async function resolveLibraryFeaturedUpdate(options: {
  item: Pick<LibraryItem, "published" | "featuredOnHomepage" | "featuredAt">;
  requestFeatured: boolean;
}) {
  const featuredCount = await getFeaturedHomepageLibraryCount();
  return resolveHomepageFeaturedUpdate({
    isEligible: options.item.published,
    requestFeatured: options.requestFeatured,
    currentlyFeatured: options.item.featuredOnHomepage,
    currentFeaturedAt: options.item.featuredAt,
    featuredCount,
    maxFeatured: HOMEPAGE_FEATURED_RESOURCES_MAX,
    resourceLabel: "resources",
  });
}

export async function getAllLibraryItems(): Promise<LibraryItem[]> {
  return prisma.libraryItem.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getLibraryItemById(id: string): Promise<LibraryItem | null> {
  return prisma.libraryItem.findUnique({ where: { id } });
}
