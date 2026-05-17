"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth-actions";
import { prisma } from "@/lib/prisma";
import { uniqueSlug } from "@/lib/slug";
import { libraryItemSchema } from "@/lib/validations";

function parseLibraryForm(formData: FormData) {
  const pdfUrl = formData.get("pdfUrl");
  return libraryItemSchema.safeParse({
    title: formData.get("title"),
    author: formData.get("author"),
    topic: formData.get("topic"),
    level: formData.get("level"),
    language: formData.get("language"),
    pdfUrl: pdfUrl ? String(pdfUrl) : "",
    published: formData.get("published") === "on",
  });
}

export async function createLibraryItem(formData: FormData) {
  await requireAdmin();
  const parsed = parseLibraryForm(formData);
  if (!parsed.success) throw new Error("Invalid library item data");

  const data = {
    ...parsed.data,
    pdfUrl: parsed.data.pdfUrl || null,
  };

  const id = await uniqueSlug(parsed.data.title, async (slug) => {
    return Boolean(await prisma.libraryItem.findUnique({ where: { id: slug } }));
  });

  await prisma.libraryItem.create({ data: { id, ...data } });

  revalidatePath("/library");
  revalidatePath("/admin/library");
  redirect(`/admin/library/${id}/edit?created=1`);
}

export async function updateLibraryItem(id: string, formData: FormData) {
  await requireAdmin();
  const parsed = parseLibraryForm(formData);
  if (!parsed.success) throw new Error("Invalid library item data");

  await prisma.libraryItem.update({
    where: { id },
    data: {
      ...parsed.data,
      pdfUrl: parsed.data.pdfUrl || null,
    },
  });

  revalidatePath("/library");
  revalidatePath("/admin/library");
  redirect(`/admin/library/${id}/edit?saved=1`);
}

export async function deleteLibraryItem(id: string) {
  await requireAdmin();
  await prisma.libraryItem.delete({ where: { id } });
  revalidatePath("/library");
  revalidatePath("/admin/library");
  redirect("/admin/library?deleted=1");
}
