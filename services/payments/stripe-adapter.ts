import { PaymentGatewayProvider, CreateCheckoutSessionParams, StandardizedPaymentEvent } from "@/types/payment-gateway";
import crypto from "crypto";

export class StripeAdapter implements PaymentGatewayProvider {
  async createCheckoutSession(params: CreateCheckoutSessionParams) {
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecret) {
      throw new Error("STRIPE_SECRET_KEY is not configured.");
    }

    const bodyParams = new URLSearchParams();
    bodyParams.append("payment_method_types[0]", "card");
    bodyParams.append("line_items[0][price_data][currency]", "inr");
    bodyParams.append("line_items[0][price_data][product_data][name]", `DQA Program Payment - ${params.paymentType.toUpperCase()}`);
    bodyParams.append("line_items[0][price_data][unit_amount]", String(params.amountInrPaise));
    bodyParams.append("line_items[0][quantity]", "1");
    bodyParams.append("mode", "payment");
    bodyParams.append("success_url", `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/profile/payments?success=1`);
    bodyParams.append("cancel_url", `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/profile/courses`);
    
    bodyParams.append("metadata[userId]", params.userId);
    bodyParams.append("metadata[paymentType]", params.paymentType);
    if (params.courseId) bodyParams.append("metadata[courseId]", params.courseId);
    if (params.bookOrderId) bodyParams.append("metadata[bookOrderId]", params.bookOrderId);
    
    if (params.metadata) {
      Object.entries(params.metadata).forEach(([key, val]) => {
        bodyParams.append(`metadata[${key}]`, val);
      });
    }

    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeSecret}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: bodyParams.toString(),
    });

    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      throw new Error(`Stripe Checkout Session creation failed: ${JSON.stringify(errorJson)}`);
    }

    const session = await res.json();
    return {
      checkoutUrl: session.url,
      gatewaySessionId: session.id,
    };
  }

  async verifyWebhook(rawBody: string, headers: Headers) {
    const signatureHeader = headers.get("stripe-signature") || "";
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new Error("STRIPE_WEBHOOK_SECRET is not configured.");
    }

    const isValid = this.verifySignature(rawBody, signatureHeader, webhookSecret);
    if (!isValid) {
      throw new Error("Invalid Stripe signature.");
    }

    const event = JSON.parse(rawBody);
    if (event.type !== "checkout.session.completed") {
      throw new Error(`Unhandled Stripe event type: ${event.type}`);
    }

    const session = event.data.object;
    const metadata = session.metadata || {};

    return {
      type: "payment.succeeded" as const,
      gatewaySessionId: session.id,
      amountInrPaise: session.amount_total,
      userId: metadata.userId,
      paymentType: metadata.paymentType as any,
      courseId: metadata.courseId || null,
      bookOrderId: metadata.bookOrderId || null,
      metadata,
    };
  }

  private verifySignature(payload: string, header: string, secret: string): boolean {
    const parts = header.split(",");
    const tPart = parts.find((p) => p.startsWith("t="));
    const v1Part = parts.find((p) => p.startsWith("v1="));
    if (!tPart || !v1Part) return false;

    const timestamp = tPart.split("=")[1];
    const signature = v1Part.split("=")[1];
    if (!timestamp || !signature) return false;

    const tolerance = 300; // 5 minutes
    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - Number(timestamp)) > tolerance) {
      return false;
    }

    const signedPayload = `${timestamp}.${payload}`;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(signedPayload)
      .digest("hex");

    try {
      return crypto.timingSafeEqual(
        Buffer.from(expectedSignature, "hex"),
        Buffer.from(signature, "hex")
      );
    } catch {
      return false;
    }
  }
}
