import { sendPaymentReceiptEmail } from "@/lib/email";
import { deleteUploadedReceipt } from "@/lib/receipt-upload";
import { getReceiptDownloadUrl } from "@/lib/payment-receipt";
import { getCourseById } from "@/lib/courses";
import { prisma } from "@/lib/prisma";

export async function sendReceiptEmailForPayment(
  paymentRecordId: string,
  options?: { useGeneratedReceipt?: boolean },
): Promise<{ error?: string }> {
  const record = await prisma.paymentRecord.findUnique({
    where: { id: paymentRecordId },
    include: {
      user: { select: { name: true, email: true } },
      submission: {
        select: { paymentMethod: true, upiTransactionId: true },
      },
    },
  });

  if (!record) {
    return { error: "Payment record not found." };
  }

  const course = record.courseId ? await getCourseById(record.courseId) : null;
  const courseTitle = course?.title ?? "Darse Quran Academy";

  if (options?.useGeneratedReceipt && record.uploadedReceiptPath) {
    await deleteUploadedReceipt(record.uploadedReceiptPath);
    await prisma.paymentRecord.update({
      where: { id: paymentRecordId },
      data: { uploadedReceiptPath: null },
    });
  }

  const receiptUrl = getReceiptDownloadUrl(paymentRecordId);

  await sendPaymentReceiptEmail({
    to: record.user.email,
    studentName: record.user.name ?? "",
    courseTitle,
    description: record.description ?? "Payment",
    receiptUrl,
  });

  await prisma.paymentRecord.update({
    where: { id: paymentRecordId },
    data: { receiptEmailSentAt: new Date() },
  });

  return {};
}

export function isPaymentReceiptAvailable(record: { id: string }): boolean {
  return Boolean(record.id);
}
