"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth-actions";
import { prisma } from "@/lib/prisma";
import { uniqueSlug } from "@/lib/slug";
import { teacherSchema } from "@/lib/validations";

function parseTeacherForm(formData: FormData) {
  const imageUrl = formData.get("imageUrl");
  return teacherSchema.safeParse({
    name: formData.get("name"),
    specialization: formData.get("specialization"),
    bio: formData.get("bio"),
    initials: formData.get("initials"),
    imageUrl: imageUrl ? String(imageUrl) : "",
    published: formData.get("published") === "on",
  });
}

export async function createTeacher(formData: FormData) {
  await requireAdmin();
  const parsed = parseTeacherForm(formData);
  if (!parsed.success) throw new Error("Invalid teacher data");

  const data = {
    ...parsed.data,
    imageUrl: parsed.data.imageUrl || null,
  };

  const id = await uniqueSlug(parsed.data.name, async (slug) => {
    return Boolean(await prisma.teacher.findUnique({ where: { id: slug } }));
  });

  await prisma.teacher.create({ data: { id, ...data } });

  revalidatePath("/teachers");
  revalidatePath("/");
  revalidatePath("/admin/teachers");
  redirect(`/admin/teachers/${id}/edit?created=1`);
}

export async function updateTeacher(id: string, formData: FormData) {
  await requireAdmin();
  const parsed = parseTeacherForm(formData);
  if (!parsed.success) throw new Error("Invalid teacher data");

  await prisma.teacher.update({
    where: { id },
    data: {
      ...parsed.data,
      imageUrl: parsed.data.imageUrl || null,
    },
  });

  revalidatePath("/teachers");
  revalidatePath("/");
  revalidatePath("/admin/teachers");
  redirect(`/admin/teachers/${id}/edit?saved=1`);
}

export async function deleteTeacher(id: string) {
  await requireAdmin();
  await prisma.teacher.delete({ where: { id } });
  revalidatePath("/teachers");
  revalidatePath("/");
  revalidatePath("/admin/teachers");
  redirect("/admin/teachers?deleted=1");
}
