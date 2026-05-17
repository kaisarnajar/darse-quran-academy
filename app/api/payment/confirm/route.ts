import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const confirmSchema = z.object({
  enrollmentId: z.string().min(1),
  upiTransactionId: z
    .string()
    .min(8, "Enter a valid UPI transaction ID (UTR).")
    .max(50)
    .regex(/^[a-zA-Z0-9]+$/, "Transaction ID should contain only letters and numbers."),
});

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = confirmSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid request." },
        { status: 400 },
      );
    }

    const { enrollmentId, upiTransactionId } = parsed.data;

    const enrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId },
    });

    if (!enrollment || enrollment.userId !== session.user.id) {
      return NextResponse.json({ error: "Enrollment not found." }, { status: 404 });
    }

    if (enrollment.status === "active") {
      return NextResponse.json({ redirectUrl: "/my-courses" });
    }

    if (enrollment.status === "pending_verification") {
      return NextResponse.json({
        redirectUrl: "/my-courses?pending=1",
        message: "Payment already submitted. We will verify shortly.",
      });
    }

    const duplicateUtr = await prisma.enrollment.findFirst({
      where: {
        upiTransactionId,
        id: { not: enrollmentId },
      },
    });

    if (duplicateUtr) {
      return NextResponse.json(
        { error: "This transaction ID was already used. Contact support if this is a mistake." },
        { status: 400 },
      );
    }

    await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        upiTransactionId,
        status: "pending_verification",
      },
    });

    return NextResponse.json({
      redirectUrl: "/my-courses?pending=1",
      message: "Thank you! We will verify your payment and activate your enrollment.",
    });
  } catch {
    return NextResponse.json({ error: "Could not confirm payment. Please try again." }, { status: 500 });
  }
}
