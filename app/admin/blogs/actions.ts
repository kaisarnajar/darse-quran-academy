"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth-actions";
import {
  deleteBlogImageFile,
  getBlogImageFiles,
  MAX_BLOG_IMAGES,
  saveBlogImage,
  validateBlogImage,
} from "@/lib/blog-upload";
import { prisma } from "@/lib/prisma";
import { blogPostSchema } from "@/lib/validations";

function adminListPath(suffix = "") {
  return `/admin/blogs${suffix}`;
}

function parseBlogForm(formData: FormData) {
  return blogPostSchema.safeParse({
    title: formData.get("title"),
    excerpt: formData.get("excerpt"),
    body: formData.get("body"),
    published: formData.get("published") === "on",
  });
}

function getRemoveImageIds(formData: FormData): string[] {
  return formData
    .getAll("removeImage")
    .map((v) => String(v))
    .filter(Boolean);
}

async function addImagesToPost(blogPostId: string, formData: FormData, existingCount: number) {
  const files = getBlogImageFiles(formData);
  if (files.length === 0) return { error: undefined as string | undefined };

  if (existingCount + files.length > MAX_BLOG_IMAGES) {
    return {
      error: `A blog post can have at most ${MAX_BLOG_IMAGES} images. Remove some or upload fewer.`,
    };
  }

  let sortOrder = existingCount;
  for (const file of files) {
    const validation = validateBlogImage(file);
    if (validation.error) {
      return { error: validation.error };
    }

    const imagePath = await saveBlogImage(blogPostId, file);
    await prisma.blogImage.create({
      data: {
        blogPostId,
        imagePath,
        sortOrder: sortOrder++,
      },
    });
  }

  return { error: undefined };
}

function revalidateBlogPaths() {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin");
  revalidatePath("/admin/blogs");
}

export async function createBlogPost(formData: FormData) {
  const session = await requireAdmin();
  const parsed = parseBlogForm(formData);

  if (!parsed.success) {
    redirect(
      adminListPath(`/new?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid input")}`),
    );
  }

  const post = await prisma.blogPost.create({
    data: {
      title: parsed.data.title,
      excerpt: parsed.data.excerpt || null,
      body: parsed.data.body,
      published: parsed.data.published,
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
  const toRemove = existing.images.filter((img) => removeIds.includes(img.id));

  for (const img of toRemove) {
    await deleteBlogImageFile(img.imagePath);
    await prisma.blogImage.delete({ where: { id: img.id } });
  }

  const remainingCount = existing.images.length - toRemove.length;

  const imageResult = await addImagesToPost(id, formData, remainingCount);
  if (imageResult.error) {
    redirect(adminListPath(`/${id}/edit?error=${encodeURIComponent(imageResult.error)}`));
  }

  await prisma.blogPost.update({
    where: { id },
    data: {
      title: parsed.data.title,
      excerpt: parsed.data.excerpt || null,
      body: parsed.data.body,
      published: parsed.data.published,
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
