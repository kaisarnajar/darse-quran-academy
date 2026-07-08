export type PaymentType = "enrollment" | "monthly" | "book_purchase";

export interface CreateCheckoutSessionParams {
  userId: string;
  email: string;
  amountInrPaise: number;
  paymentType: PaymentType;
  courseId?: string | null;
  bookOrderId?: string | null;
  metadata?: Record<string, string>;
}

export interface StandardizedPaymentEvent {
  type: "payment.succeeded" | "payment.failed" | "payment.refunded";
  gatewaySessionId: string;
  amountInrPaise: number;
  userId: string;
  paymentType: PaymentType;
  courseId?: string | null;
  bookOrderId?: string | null;
  metadata?: Record<string, string>;
}

export interface PaymentGatewayProvider {
  /**
   * Initializes a checkout session and returns a redirect URL for the student.
   */
  createCheckoutSession(params: CreateCheckoutSessionParams): Promise<{
    checkoutUrl: string;
    gatewaySessionId: string;
  }>;

  /**
   * Cryptographically verifies incoming payloads and parses them into standard events.
   */
  verifyWebhook(rawBody: string, headers: Headers): Promise<StandardizedPaymentEvent>;
}
