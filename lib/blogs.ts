import type { BlogImage, BlogPost } from "@prisma/client";
import { BLOG_PUBLIC_WHERE } from "@/lib/blog-approval";
import { resolveHomepageFeaturedUpdate } from "@/lib/homepage-featured";
import { prisma } from "@/lib/prisma";

export const HOMEPAGE_FEATURED_BLOGS_MAX = 4;

export type BlogPostWithImages = BlogPost & {
  images: BlogImage[];
  createdBy: { name: string | null; email?: string | null } | null;
};

export function formatBlogDate(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function isBlogPubliclyVisible(post: Pick<BlogPost, "published" | "approvalStatus">): boolean {
  return post.published && post.approvalStatus === "APPROVED";
}

export async function getFeaturedHomepageBlogPosts(): Promise<BlogPostWithImages[]> {
  const posts = await prisma.blogPost.findMany({
    where: { featuredOnHomepage: true },
    orderBy: [{ featuredAt: "desc" }, { updatedAt: "desc" }],
    take: HOMEPAGE_FEATURED_BLOGS_MAX,
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      createdBy: { select: { name: true } },
    },
  });

  return posts.filter(isBlogPubliclyVisible);
}

export async function getFeaturedHomepageBlogCount(): Promise<number> {
  const posts = await prisma.blogPost.findMany({
    where: { featuredOnHomepage: true },
    select: { published: true, approvalStatus: true },
  });
  return posts.filter(isBlogPubliclyVisible).length;
}

export async function resolveBlogFeaturedUpdate(options: {
  post: Pick<BlogPost, "published" | "approvalStatus" | "featuredOnHomepage" | "featuredAt">;
  requestFeatured: boolean;
}) {
  const featuredCount = await getFeaturedHomepageBlogCount();
  return resolveHomepageFeaturedUpdate({
    isEligible: isBlogPubliclyVisible(options.post),
    requestFeatured: options.requestFeatured,
    currentlyFeatured: options.post.featuredOnHomepage,
    currentFeaturedAt: options.post.featuredAt,
    featuredCount,
    maxFeatured: HOMEPAGE_FEATURED_BLOGS_MAX,
    resourceLabel: "blogs",
  });
}

export async function getPublishedBlogPosts(limit?: number) {
  return prisma.blogPost.findMany({
    where: BLOG_PUBLIC_WHERE,
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      createdBy: { select: { name: true } },
    },
  });
}

export async function getPublishedBlogPostById(id: string) {
  return prisma.blogPost.findFirst({
    where: { id, ...BLOG_PUBLIC_WHERE },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      createdBy: { select: { name: true } },
    },
  });
}

export async function getAllBlogPostsForAdmin() {
  return prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      createdBy: { select: { name: true, email: true } },
    },
  });
}

export async function getBlogPostForAdmin(id: string) {
  return prisma.blogPost.findUnique({
    where: { id },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      createdBy: { select: { name: true, email: true } },
    },
  });
}

export async function getTeacherBlogPosts(userId: string) {
  return prisma.blogPost.findMany({
    where: { createdById: userId },
    orderBy: { createdAt: "desc" },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
    },
  });
}

export async function getBlogPostForTeacher(id: string, userId: string) {
  return prisma.blogPost.findFirst({
    where: { id, createdById: userId },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
    },
  });
}
