"use server";

import { requireDeveloper } from "@/services/auth-actions";
import { getPaymentGateway } from "@/services/payments/gateway-factory";
import { prisma } from "@/utils/prisma";
import { redirect } from "next/navigation";

export async function startGatewayTest() {
  const session = await requireDeveloper();
  const userId = session.user.id;
  const email = session.user.email!;

  // 1. Fetch first available course to use for credentials testing
  let course = await prisma.course.findFirst();

  // If no course is seeded, create a temporary testing course
  if (!course) {
    course = await prisma.course.create({
      data: {
        id: "gateway-test-course",
        title: "Gateway Test Program",
        description: "Simulated course listing for verification of payment credentials.",
        startDate: "Immediate",
        duration: "1 Month",
        level: "Beginner",
        category: "General",
        priceInrPaise: 1000, // ₹10.00
        monthlyFeeInrPaise: 1000,
        status: "PUBLISHED",
      },
    });
  }

  // 2. Initialize checkout session via factory
  const gateway = getPaymentGateway();
  const amountPaise = 1000; // ₹10.00 testing amount

  const { checkoutUrl, gatewaySessionId } = await gateway.createCheckoutSession({
    userId,
    email,
    amountInrPaise: amountPaise,
    paymentType: "enrollment",
    courseId: course.id,
    metadata: {
      isGatewayTest: "true",
      courseTitle: course.title,
    },
  });

  // 3. Create a placeholder transaction log to await the webhook callback
  await prisma.coursePaymentSubmission.create({
    data: {
      userId,
      courseId: course.id,
      paymentType: "enrollment",
      label: `Gateway Credentials Test — ${course.title}`,
      amountInrPaise: amountPaise,
      status: "pending_verification",
      paymentMethod: (process.env.PAYMENT_GATEWAY_PROVIDER || "STRIPE").toLowerCase(),
      upiTransactionId: gatewaySessionId,
      paymentReference: gatewaySessionId,
    },
  });

  // 4. Redirect browser to hosted checkout page
  redirect(checkoutUrl);
}
