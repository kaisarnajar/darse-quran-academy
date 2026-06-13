"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth-actions";
import { sendContactInquiryReplyEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { contactInquiryReplySchema } from "@/lib/validations";

export async function replyToContactInquiry(id: string, formData: FormData) {
  const session = await requireAdmin();

  const parsed = contactInquiryReplySchema.safeParse({
    reply: formData.get("reply"),
  });

  if (!parsed.success) {
    redirect(
      `/admin/contact-inquiries/${id}/reply?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid reply")}`,
    );
  }

  const inquiry = await prisma.contactInquiry.findUnique({ where: { id } });
  if (!inquiry) {
    redirect("/admin/contact-inquiries?error=notfound");
  }

  const now = new Date();

  await prisma.contactInquiry.update({
    where: { id },
    data: {
      reply: parsed.data.reply,
      repliedAt: inquiry.repliedAt ?? now,
      repliedById: session.user.id,
    },
  });

  const emailResult = await sendContactInquiryReplyEmail({
    to: inquiry.email,
    name: inquiry.name,
    originalMessage: inquiry.message,
    reply: parsed.data.reply,
  });

  revalidatePath("/admin/contact-inquiries");
  revalidatePath(`/admin/contact-inquiries/${id}`);
  revalidatePath(`/admin/contact-inquiries/${id}/reply`);
  revalidatePath("/admin");

  const savedParams = new URLSearchParams({ saved: "1" });
  if (!emailResult.sent) {
    savedParams.set("email", emailResult.skipped ? "skipped" : "failed");
  }

  redirect(`/admin/contact-inquiries?${savedParams.toString()}`);
}

export async function deleteContactInquiryById(id: string): Promise<{ error?: string }> {
  await requireAdmin();

  const inquiry = await prisma.contactInquiry.findUnique({ where: { id } });
  if (!inquiry) {
    return { error: "Inquiry not found." };
  }

  await prisma.contactInquiry.delete({ where: { id } });

  revalidatePath("/admin/contact-inquiries");
  revalidatePath(`/admin/contact-inquiries/${id}`);
  revalidatePath(`/admin/contact-inquiries/${id}/reply`);
  revalidatePath("/admin");

  return {};
}

export async function deleteContactInquiryForm(id: string) {
  const result = await deleteContactInquiryById(id);
  if (result.error) {
    redirect(`/admin/contact-inquiries/${id}?error=${encodeURIComponent(result.error)}`);
  }
  redirect("/admin/contact-inquiries?deleted=1");
}
