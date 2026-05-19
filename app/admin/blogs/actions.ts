"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth-actions";
import { deleteBlogImageFile } from "@/lib/blog-upload";
import { addImagesToPost, getRemoveImageIds, parseBlogForm, removeBlogImages } from "@/lib/blog-mutations";
import { prisma } from "@/lib/prisma";

function adminListPath(suffix = "") {
  return `/admin/blogs${suffix}`;
}

function revalidateBlogPaths() {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin");
  revalidatePath("/admin/blogs");
  revalidatePath("/admin/blog-approvals");
  revalidatePath("/teacher/blogs");
}

export async function createBlogPost(formData: FormData) {
  const session = await requireAdmin();
  const parsed = parseBlogForm(formData);

  if (!parsed.success) {
    redirect(
      adminListPath(`/new?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid input")}`),
    );
  }

  const published = parsed.data.published;

  const post = await prisma.blogPost.create({
    data: {
      title: parsed.data.title,
      excerpt: parsed.data.excerpt || null,
      body: parsed.data.body,
      published,
      approvalStatus: published ? "APPROVED" : "DRAFT",
      createdById: session.user.id,
    },
  });

  const imageResult = await addImagesToPost(post.id, formData, 0);
  if (imageResult.error) {
    await prisma.blogPost.delete({ where: { id: post.id } });
    redirect(adminListPath(`/new?error=${encodeURIComponent(imageResult.error)}`));
  }

  revalidateBlogPaths();
  redirect(adminListPath(`/${post.id}/edit?posted=1`));
}

export async function updateBlogPost(id: string, formData: FormData) {
  await requireAdmin();
  const parsed = parseBlogForm(formData);

  if (!parsed.success) {
    redirect(
      adminListPath(`/${id}/edit?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid input")}`),
    );
  }

  const existing = await prisma.blogPost.findUnique({
    where: { id },
    include: { images: true },
  });

  if (!existing) {
    redirect(adminListPath("?error=notfound"));
  }

  const removeIds = getRemoveImageIds(formData);
  await removeBlogImages(removeIds, id);

  const remainingCount = existing.images.length - existing.images.filter((img) => removeIds.includes(img.id)).length;

  const imageResult = await addImagesToPost(id, formData, remainingCount);
  if (imageResult.error) {
    redirect(adminListPath(`/${id}/edit?error=${encodeURIComponent(imageResult.error)}`));
  }

  const published = parsed.data.published;

  await prisma.blogPost.update({
    where: { id },
    data: {
      title: parsed.data.title,
      excerpt: parsed.data.excerpt || null,
      body: parsed.data.body,
      published,
      approvalStatus: published
        ? "APPROVED"
        : existing.approvalStatus === "APPROVED"
          ? "DRAFT"
          : existing.approvalStatus,
    },
  });

  revalidateBlogPaths();
  revalidatePath(`/blog/${id}`);
  redirect(adminListPath(`/${id}/edit?saved=1`));
}

export async function deleteBlogPost(id: string) {
  await requireAdmin();

  const existing = await prisma.blogPost.findUnique({
    where: { id },
    include: { images: true },
  });

  if (!existing) {
    redirect(adminListPath("?error=notfound"));
  }

  for (const img of existing.images) {
    await deleteBlogImageFile(img.imagePath);
  }

  await prisma.blogPost.delete({ where: { id } });

  revalidateBlogPaths();
  redirect(adminListPath("?deleted=1"));
}
