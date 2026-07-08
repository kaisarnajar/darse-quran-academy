import { PaymentGatewayProvider, CreateCheckoutSessionParams, StandardizedPaymentEvent } from "@/types/payment-gateway";
import crypto from "crypto";

export class RazorpayAdapter implements PaymentGatewayProvider {
  async createCheckoutSession(params: CreateCheckoutSessionParams) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      throw new Error("Razorpay credentials are not configured.");
    }

    const authHeader = `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`;

    const notes: Record<string, string> = {
      userId: params.userId,
      paymentType: params.paymentType,
      courseId: params.courseId || "",
      bookOrderId: params.bookOrderId || "",
    };

    if (params.metadata) {
      Object.entries(params.metadata).forEach(([key, val]) => {
        notes[key] = val;
      });
    }

    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: params.amountInrPaise,
        currency: "INR",
        notes,
      }),
    });

    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      throw new Error(`Razorpay Order creation failed: ${JSON.stringify(errorJson)}`);
    }

    const order = await res.json();
    return {
      checkoutUrl: `https://api.razorpay.com/v1/checkout/hosted?order_id=${order.id}`,
      gatewaySessionId: order.id,
    };
  }

  async verifyWebhook(rawBody: string, headers: Headers) {
    const signature = headers.get("x-razorpay-signature") || "";
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret) {
      throw new Error("RAZORPAY_WEBHOOK_SECRET is not configured.");
    }

    const expected = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    if (expected !== signature) {
      throw new Error("Invalid Razorpay signature.");
    }

    const payload = JSON.parse(rawBody);
    if (payload.event !== "order.paid") {
      throw new Error(`Unhandled Razorpay event type: ${payload.event}`);
    }

    const order = payload.payload.order.entity;
    const payment = payload.payload.payment.entity;
    const notes = order.notes || payment.notes || {};

    return {
      type: "payment.succeeded" as const,
      gatewaySessionId: order.id,
      amountInrPaise: order.amount,
      userId: notes.userId,
      paymentType: notes.paymentType as any,
      courseId: notes.courseId || null,
      bookOrderId: notes.bookOrderId || null,
      metadata: notes,
    };
  }
}
