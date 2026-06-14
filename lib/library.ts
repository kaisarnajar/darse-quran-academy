import type { LibraryItem as PrismaLibraryItem } from "@prisma/client";
import { isLibraryTopic } from "@/lib/library-options";
import { resolveHomepageFeaturedUpdate } from "@/lib/homepage-featured";
import { clampPage, paginationArgs, type PaginatedResult } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";
import { buildSearchOr } from "@/lib/text-search";

function allLibraryItemsWhere(searchQuery?: string) {
  if (!searchQuery) return undefined;
  return buildSearchOr(["title", "author", "topic"], [], searchQuery);
}

export const HOMEPAGE_FEATURED_RESOURCES_MAX = 4;

export type LibraryItem = PrismaLibraryItem;

function publishedLibraryWhere(topic?: string) {
  return {
    published: true,
    ...(topic && isLibraryTopic(topic) ? { topic } : {}),
  };
}

export async function getPublishedLibraryItemsPaginated(
  page: number,
  pageSize: number,
  topic?: string,
): Promise<PaginatedResult<LibraryItem>> {
  const where = publishedLibraryWhere(topic);
  const totalCount = await prisma.libraryItem.count({ where });
  const safePage = clampPage(page, totalCount, pageSize);
  const items = await prisma.libraryItem.findMany({
    where,
    orderBy: { createdAt: "desc" },
    ...paginationArgs(safePage, pageSize),
  });
  return { items, totalCount };
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

export async function getAllLibraryItemsPaginated(
  page: number,
  pageSize: number,
  searchQuery?: string,
): Promise<PaginatedResult<LibraryItem>> {
  const where = allLibraryItemsWhere(searchQuery);
  const totalCount = await prisma.libraryItem.count({ where });
  const safePage = clampPage(page, totalCount, pageSize);
  const items = await prisma.libraryItem.findMany({
    where,
    orderBy: { createdAt: "desc" },
    ...paginationArgs(safePage, pageSize),
  });
  return { items, totalCount };
}

export async function getLibraryItemById(id: string): Promise<LibraryItem | null> {
  return prisma.libraryItem.findUnique({ where: { id } });
}
