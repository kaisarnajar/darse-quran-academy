import type { BlogApprovalStatus, BlogPost } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const BLOG_PUBLIC_WHERE = {
  published: true,
  approvalStatus: "APPROVED" as const,
};

export function blogApprovalStatusLabel(
  status: BlogApprovalStatus,
  published = false,
): string {
  switch (status) {
    case "PENDING":
      return "Pending approval";
    case "APPROVED":
      return published ? "Published" : "Approved";
    case "REJECTED":
      return "Rejected";
    case "DRAFT":
    default:
      return "Draft";
  }
}

export function blogApprovalStatusClass(status: BlogApprovalStatus, published: boolean): string {
  if (status === "PENDING") return "bg-amber-100 text-amber-900";
  if (status === "REJECTED") return "bg-red-100 text-red-900";
  if (status === "DRAFT") return "bg-stone-200 text-stone-800";
  if (published) return "bg-emerald-100 text-emerald-900";
  return "bg-violet-100 text-violet-900";
}

export function canTeacherEditBlogPost(post: Pick<BlogPost, "approvalStatus" | "createdById">, userId: string) {
  return post.createdById === userId && (post.approvalStatus === "PENDING" || post.approvalStatus === "REJECTED");
}

/** Teachers may delete their own posts at any approval stage. */
export function canTeacherDeleteBlogPost(post: Pick<BlogPost, "createdById">, userId: string) {
  return post.createdById === userId;
}

export async function getPendingBlogApprovalCount() {
  return prisma.blogPost.count({ where: { approvalStatus: "PENDING" } });
}

export async function getPendingBlogPostsForAdmin() {
  return prisma.blogPost.findMany({
    where: { approvalStatus: "PENDING" },
    orderBy: { createdAt: "asc" },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      createdBy: { select: { name: true, email: true } },
    },
  });
}
