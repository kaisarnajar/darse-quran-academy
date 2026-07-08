import { NextResponse } from "next/server";
import { getPaymentGateway } from "@/services/payments/gateway-factory";
import { handlePaymentSuccess } from "@/services/payments/reconciliation";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const gateway = getPaymentGateway();

  try {
    const event = await gateway.verifyWebhook(rawBody, request.headers);

    if (event.type === "payment.succeeded") {
      await handlePaymentSuccess(event);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Payments Webhook Error]:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Webhook processing failed" },
      { status: 400 }
    );
  }
}
