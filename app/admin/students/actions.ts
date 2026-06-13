"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminEmail } from "@/lib/admin";
import { requireAdmin } from "@/lib/auth-actions";
import { prisma } from "@/lib/prisma";

function revalidateStudentPaths(courseIds: string[] = []) {
  revalidatePath("/admin/students");
  revalidatePath("/admin/enrollments");
  revalidatePath("/admin/courses");
  revalidatePath("/admin");
  revalidatePath("/profile");
  revalidatePath("/profile/courses");
  revalidatePath("/profile/payments");
  for (const courseId of courseIds) {
    revalidatePath(`/admin/courses/${courseId}/students`);
  }
}

export async function deleteStudentUser(id: string): Promise<{ error?: string }> {
  await requireAdmin();

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    return { error: "Student not found." };
  }

  if (isAdminEmail(user.email)) {
    return { error: "The admin account cannot be deleted." };
  }

  const courseIds = (
    await prisma.enrollment.findMany({
      where: { userId: id },
      select: { courseId: true },
    })
  ).map((e) => e.courseId);

  await prisma.user.delete({ where: { id } });

  revalidateStudentPaths(courseIds);

  return {};
}

export async function deleteStudentUserForm(id: string) {
  const result = await deleteStudentUser(id);
  if (result.error) {
    redirect(`/admin/students/${id}?error=${encodeURIComponent(result.error)}`);
  }
  redirect("/admin/students?deleted=1");
}
