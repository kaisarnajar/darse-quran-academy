import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { savePaymentScreenshot, validatePaymentScreenshot } from "@/lib/payment-upload";
import { prisma } from "@/lib/prisma";

const transactionIdSchema = z
  .string()
  .min(8, "Enter a valid transaction / UTR reference (at least 8 characters).")
  .max(50)
  .regex(/^[a-zA-Z0-9]+$/, "Reference should contain only letters and numbers.");

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const enrollmentId = String(formData.get("enrollmentId") ?? "");
    const paymentMethodRaw = String(formData.get("paymentMethod") ?? "upi");
    const upiTransactionId = String(formData.get("upiTransactionId") ?? "").trim();
    const screenshot = formData.get("screenshot");

    const paymentMethodParsed = z.enum(["upi", "bank"]).safeParse(paymentMethodRaw);
    if (!paymentMethodParsed.success) {
      return NextResponse.json({ error: "Select a payment method." }, { status: 400 });
    }

    const paymentMethod = paymentMethodParsed.data;

    const txParsed = transactionIdSchema.safeParse(upiTransactionId);
    if (!txParsed.success) {
      return NextResponse.json(
        { error: txParsed.error.issues[0]?.message ?? "Invalid transaction reference." },
        { status: 400 },
      );
    }

    if (!enrollmentId) {
      return NextResponse.json({ error: "Enrollment not found." }, { status: 400 });
    }

    const screenshotFile = screenshot instanceof File ? screenshot : null;
    const screenshotValidation = validatePaymentScreenshot(screenshotFile);
    if (screenshotValidation.error) {
      return NextResponse.json({ error: screenshotValidation.error }, { status: 400 });
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId },
    });

    if (!enrollment || enrollment.userId !== session.user.id) {
      return NextResponse.json({ error: "Enrollment not found." }, { status: 404 });
    }

    if (enrollment.status === "active") {
      return NextResponse.json({ redirectUrl: "/profile/courses" });
    }

    if (enrollment.status === "pending_verification") {
      return NextResponse.json({
        redirectUrl: "/profile/courses?pending=1",
        message: "Payment already submitted. We will verify shortly.",
      });
    }

    const duplicateUtr = await prisma.enrollment.findFirst({
      where: {
        upiTransactionId: txParsed.data,
        id: { not: enrollmentId },
      },
    });

    if (duplicateUtr) {
      return NextResponse.json(
        { error: "This transaction reference was already used. Contact support if this is a mistake." },
        { status: 400 },
      );
    }

    let paymentScreenshotPath: string | undefined;
    if (screenshotFile && screenshotFile.size > 0) {
      paymentScreenshotPath = await savePaymentScreenshot(enrollmentId, screenshotFile);
    }

    await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        upiTransactionId: txParsed.data,
        paymentMethod,
        paymentScreenshotPath: paymentScreenshotPath ?? enrollment.paymentScreenshotPath,
        status: "pending_verification",
      },
    });

    return NextResponse.json({
      redirectUrl: "/profile/courses?pending=1",
      message: "Thank you! We will verify your payment and activate your enrollment.",
    });
  } catch {
    return NextResponse.json({ error: "Could not confirm payment. Please try again." }, { status: 500 });
  }
}
