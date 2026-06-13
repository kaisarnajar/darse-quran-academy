"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth-actions";
import { prisma } from "@/lib/prisma";

function revalidateBlogPaths(postId?: string) {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin");
  revalidatePath("/admin/blogs");
  revalidatePath("/admin/blog-approvals");
  if (postId) {
    revalidatePath(`/admin/blog-approvals/${postId}`);
  }
  revalidatePath("/teacher/blogs");
}

function returnUrl(returnTo: string | undefined, event: "approved" | "rejected"): string {
  const param = event === "approved" ? "approved" : "rejected";
  const fallback = `/admin/blog-approvals?${param}=1`;
  if (!returnTo?.startsWith("/admin")) return fallback;
  const [pathname, query = ""] = returnTo.split("?");
  const params = new URLSearchParams(query);
  params.set(param, "1");
  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : `${pathname}?${param}=1`;
}

export async function approveBlogPost(
  postId: string,
  returnTo?: string,
): Promise<{ error?: string }> {
  await requireAdmin();

  const post = await prisma.blogPost.findUnique({ where: { id: postId } });
  if (!post) return { error: "Blog post not found." };
  if (post.approvalStatus !== "PENDING") {
    return { error: "This post is no longer pending approval." };
  }

  await prisma.blogPost.update({
    where: { id: postId },
    data: { approvalStatus: "APPROVED", published: true },
  });

  revalidateBlogPaths(postId);
  revalidatePath(`/blog/${postId}`);
  redirect(returnUrl(returnTo, "approved"));
}

export async function rejectBlogPost(
  postId: string,
  returnTo?: string,
): Promise<{ error?: string }> {
  await requireAdmin();

  const post = await prisma.blogPost.findUnique({ where: { id: postId } });
  if (!post) return { error: "Blog post not found." };
  if (post.approvalStatus !== "PENDING") {
    return { error: "This post is no longer pending approval." };
  }

  await prisma.blogPost.update({
    where: { id: postId },
    data: { approvalStatus: "REJECTED", published: false, featuredOnHomepage: false, featuredAt: null },
  });

  revalidateBlogPaths(postId);
  redirect(returnUrl(returnTo, "rejected"));
}
