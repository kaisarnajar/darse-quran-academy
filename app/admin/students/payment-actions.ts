"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-actions";
import { getCourseById } from "@/lib/courses";
import { rupeesToPaise } from "@/lib/form";
import { prisma } from "@/lib/prisma";
import { paymentRecordSchema } from "@/lib/validations";

export type RecordPaymentState = {
  error?: string;
  success?: string;
};

export async function recordStudentPayment(
  userId: string,
  _prev: RecordPaymentState,
  formData: FormData,
): Promise<RecordPaymentState> {
  await requireAdmin();

  const parsed = paymentRecordSchema.safeParse({
    courseId: formData.get("courseId") || undefined,
    amountInr: formData.get("amountInr"),
    paidAt: formData.get("paidAt"),
    description: formData.get("description") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid payment data." };
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return { error: "Student not found." };
  }

  const courseId = parsed.data.courseId?.trim() || null;
  if (courseId) {
    const course = await getCourseById(courseId);
    if (!course) {
      return { error: "Course not found." };
    }
  }

  const paidAt = new Date(parsed.data.paidAt);
  if (Number.isNaN(paidAt.getTime())) {
    return { error: "Invalid payment date." };
  }

  await prisma.paymentRecord.create({
    data: {
      userId,
      courseId,
      amountInrPaise: rupeesToPaise(parsed.data.amountInr),
      paidAt,
      description: parsed.data.description?.trim() || null,
    },
  });

  revalidatePath(`/admin/students/${userId}`);
  revalidatePath("/profile/payments");

  return { success: "Payment recorded." };
}
