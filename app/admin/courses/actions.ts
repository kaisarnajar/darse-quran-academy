"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth-actions";
import { rupeesToPaise } from "@/lib/form";
import { prisma } from "@/lib/prisma";
import { uniqueSlug } from "@/lib/slug";
import { courseSchema } from "@/lib/validations";

function parseCourseForm(formData: FormData) {
  const priceRupees = formData.get("priceRupees");
  return courseSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    startDate: formData.get("startDate"),
    level: formData.get("level"),
    category: formData.get("category"),
    priceInrPaise: rupeesToPaise(Number(priceRupees)),
    published: formData.get("published") === "on",
  });
}

export async function createCourse(formData: FormData) {
  await requireAdmin();
  const parsed = parseCourseForm(formData);

  if (!parsed.success) {
    throw new Error("Invalid course data");
  }

  const id = await uniqueSlug(parsed.data.title, async (slug) => {
    const existing = await prisma.course.findUnique({ where: { id: slug } });
    return Boolean(existing);
  });

  await prisma.course.create({
    data: { id, ...parsed.data },
  });

  revalidatePath("/");
  revalidatePath("/courses");
  revalidatePath("/admin/courses");
  redirect(`/admin/courses/${id}/edit?created=1`);
}

export async function updateCourse(id: string, formData: FormData) {
  await requireAdmin();
  const parsed = parseCourseForm(formData);

  if (!parsed.success) {
    throw new Error("Invalid course data");
  }

  await prisma.course.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePath("/");
  revalidatePath("/courses");
  revalidatePath("/admin/courses");
  revalidatePath(`/admin/courses/${id}/edit`);
  redirect(`/admin/courses/${id}/edit?saved=1`);
}

export async function deleteCourse(id: string) {
  await requireAdmin();

  const enrollmentCount = await prisma.enrollment.count({
    where: { courseId: id },
  });

  if (enrollmentCount > 0) {
    redirect(
      `/admin/courses/${id}/edit?deleteError=${encodeURIComponent(
        `Cannot delete: ${enrollmentCount} enrollment(s) exist. Unpublish instead.`,
      )}`,
    );
  }

  await prisma.course.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/courses");
  revalidatePath("/admin/courses");
  redirect("/admin/courses?deleted=1");
}
