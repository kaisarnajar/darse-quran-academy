import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isAdminSession } from "@/lib/admin";
import { getCourseById } from "@/lib/courses";
import {
  formatReceiptId,
  generatePaymentReceiptPdf,
  getReceiptFilename,
} from "@/lib/payment-receipt";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ paymentRecordId: string }> },
) {
  const { paymentRecordId } = await params;

  const record = await prisma.paymentRecord.findUnique({
    where: { id: paymentRecordId },
    include: {
      user: { select: { id: true, name: true } },
      submission: {
        select: { paymentMethod: true, upiTransactionId: true },
      },
    },
  });

  if (!record) {
    return NextResponse.json({ error: "Receipt not found." }, { status: 404 });
  }

  const session = await auth();
  const isOwner = session?.user?.id === record.userId;
  const isAdmin = isAdminSession(session);

  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const course = record.courseId ? await getCourseById(record.courseId) : null;
  const courseTitle = course?.title ?? "Darse Quran Academy";
  const filename = getReceiptFilename(courseTitle, paymentRecordId);

  if (record.uploadedReceiptPath) {
    const absolutePath = path.join(
      process.cwd(),
      "public",
      record.uploadedReceiptPath.replace(/^\//, ""),
    );

    try {
      const pdfBytes = await readFile(absolutePath);
      return new NextResponse(Buffer.from(pdfBytes), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Cache-Control": "private, no-cache",
        },
      });
    } catch {
      return NextResponse.json({ error: "Uploaded receipt file not found." }, { status: 404 });
    }
  }

  const pdfBytes = await generatePaymentReceiptPdf({
    receiptId: formatReceiptId(paymentRecordId),
    studentName: record.user.name ?? "Student",
    courseTitle,
    description: record.description ?? "Payment",
    amountInrPaise: record.amountInrPaise,
    paidAt: record.paidAt,
    paymentMethod: record.submission?.paymentMethod ?? null,
    upiTransactionId: record.submission?.upiTransactionId ?? null,
  });

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-cache",
    },
  });
}
