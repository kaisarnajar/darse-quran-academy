"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth-actions";
import { getFatwaPublicUrl } from "@/lib/fatwa";
import { sendFatwaAnswerEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { fatwaAnswerSchema } from "@/lib/validations";

export async function answerFatwaQuestion(id: string, formData: FormData) {
  const session = await requireAdmin();

  const parsed = fatwaAnswerSchema.safeParse({
    answer: formData.get("answer"),
  });

  if (!parsed.success) {
    redirect(`/admin/fatwa/${id}?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid answer")}`);
  }

  const existing = await prisma.fatwaQuestion.findUnique({ where: { id } });
  if (!existing) {
    redirect("/admin/fatwa?error=notfound");
  }

  const now = new Date();
  await prisma.fatwaQuestion.update({
    where: { id },
    data: {
      answer: parsed.data.answer,
      answeredAt: existing.answeredAt ?? now,
      answeredById: session.user.id,
    },
  });

  revalidatePath("/fatwa");
  revalidatePath(`/fatwa/${id}`);
  revalidatePath("/admin/fatwa");
  revalidatePath(`/admin/fatwa/${id}`);

  const fatwaUrl = getFatwaPublicUrl(id);
  await sendFatwaAnswerEmail({
    to: existing.askerEmail,
    askerName: existing.askerName,
    questionTitle: existing.title,
    fatwaUrl,
  });

  redirect(`/admin/fatwa/${id}?saved=1`);
}
