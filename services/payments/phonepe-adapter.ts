import { PaymentGatewayProvider, CreateCheckoutSessionParams, StandardizedPaymentEvent } from "@/types/payment-gateway";
import crypto from "crypto";

export class PhonePeAdapter implements PaymentGatewayProvider {
  private getApiConfig() {
    const isProd = process.env.PHONEPE_ENV === "production";
    return {
      host: isProd ? "https://api.phonepe.com/apis/hermes" : "https://api-preprod.phonepe.com/apis/pg-sandbox",
      merchantId: process.env.PHONEPE_MERCHANT_ID!,
      saltKey: process.env.PHONEPE_SALT_KEY!,
      saltIndex: process.env.PHONEPE_SALT_INDEX || "1",
    };
  }

  private calculateXVerify(payloadBase64: string, apiEndpoint: string, saltKey: string, saltIndex: string): string {
    const stringToSign = payloadBase64 + apiEndpoint + saltKey;
    const sha256 = crypto.createHash("sha256").update(stringToSign).digest("hex");
    return `${sha256}###${saltIndex}`;
  }

  async createCheckoutSession(params: CreateCheckoutSessionParams) {
    const config = this.getApiConfig();
    const transactionId = `txn_${crypto.randomBytes(8).toString("hex")}`;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const rawRequestPayload = {
      merchantId: config.merchantId,
      merchantTransactionId: transactionId,
      merchantUserId: params.userId,
      amount: params.amountInrPaise,
      redirectUrl: `${appUrl}/profile/payments?success=1`,
      redirectMode: "REDIRECT",
      callbackUrl: `${appUrl}/api/payments/webhook`,
      paymentInstrument: {
        type: "PAY_PAGE"
      }
    };

    const base64Payload = Buffer.from(JSON.stringify(rawRequestPayload)).toString("base64");
    const endpoint = "/pg/v1/pay";
    const xVerify = this.calculateXVerify(base64Payload, endpoint, config.saltKey, config.saltIndex);

    const res = await fetch(`${config.host}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": xVerify,
        accept: "application/json",
      },
      body: JSON.stringify({ request: base64Payload }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(`PhonePe session creation failed: ${JSON.stringify(err)}`);
    }

    const responseData = await res.json();
    const paymentUrl = responseData.data.instrumentResponse.redirectInfo.url;

    return {
      checkoutUrl: paymentUrl,
      gatewaySessionId: transactionId,
    };
  }

  async verifyWebhook(rawBody: string, headers: Headers) {
    const config = this.getApiConfig();
    const xVerifyHeader = headers.get("x-verify") || "";
    
    const parsedBody = JSON.parse(rawBody);
    const base64Response = parsedBody.response;

    const expectedVerify = crypto
      .createHash("sha256")
      .update(base64Response + config.saltKey)
      .digest("hex") + `###${config.saltIndex}`;

    if (expectedVerify !== xVerifyHeader) {
      throw new Error("Invalid PhonePe webhook signature.");
    }

    const payload = JSON.parse(Buffer.from(base64Response, "base64").toString("utf-8"));
    if (payload.code !== "PAYMENT_SUCCESS") {
      throw new Error(`Transaction failed with PhonePe code: ${payload.code}`);
    }

    const transaction = payload.data;
    const metadata = transaction.metadata || {};

    return {
      type: "payment.succeeded" as const,
      gatewaySessionId: transaction.merchantTransactionId,
      amountInrPaise: transaction.amount,
      userId: transaction.merchantUserId,
      paymentType: "enrollment" as const, // Standard fallback
      metadata,
    };
  }
}
