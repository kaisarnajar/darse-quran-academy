"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth-actions";
import { prisma } from "@/lib/prisma";
import { getDefaultFeesForLevel } from "@/lib/course-pricing";
import { uniqueSlug } from "@/lib/slug";
import { courseSchema } from "@/lib/validations";

function parseCourseForm(formData: FormData) {
  const level = String(formData.get("level") ?? "Beginner");
  const teacherId = String(formData.get("teacherId") ?? "").trim();
  const defaults = getDefaultFeesForLevel(level);

  const parsed = courseSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    startDate: formData.get("startDate"),
    level,
    category: formData.get("category"),
    enrollmentFeeInr: formData.get("enrollmentFeeInr") ?? defaults.registrationFeeInr,
    monthlyFeeInr: formData.get("monthlyFeeInr") ?? defaults.monthlyFeeInr,
    teacherId,
    status: formData.get("status"),
  });

  if (!parsed.success) return parsed;

  return {
    success: true as const,
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      startDate: parsed.data.startDate,
      level: parsed.data.level,
      category: parsed.data.category,
      priceInrPaise: Math.round(parsed.data.enrollmentFeeInr * 100),
      monthlyFeeInrPaise: Math.round(parsed.data.monthlyFeeInr * 100),
      teacherId: parsed.data.teacherId,
      status: parsed.data.status,
    },
  };
}

export async function createCourse(formData: FormData) {
  await requireAdmin();
  const parsed = parseCourseForm(formData);

  if (!parsed.success) {
    throw new Error("Invalid course data");
  }

  const { title, ...courseData } = parsed.data;

  const id = await uniqueSlug(title, async (slug) => {
    const existing = await prisma.course.findUnique({ where: { id: slug } });
    return Boolean(existing);
  });

  await prisma.course.create({
    data: { id, title, ...courseData },
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

  const { title, ...courseData } = parsed.data;

  await prisma.course.update({
    where: { id },
    data: { title, ...courseData },
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
        `Cannot delete: ${enrollmentCount} enrollment(s) exist. Set status to Draft instead.`,
      )}`,
    );
  }

  await prisma.course.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/courses");
  revalidatePath("/admin/courses");
  redirect("/admin/courses?deleted=1");
}
