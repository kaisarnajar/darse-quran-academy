import { PaymentGatewayProvider } from "@/types/payment-gateway";
import { StripeAdapter } from "./stripe-adapter";
import { RazorpayAdapter } from "./razorpay-adapter";
import { PhonePeAdapter } from "./phonepe-adapter";

export function getPaymentGateway(): PaymentGatewayProvider {
  const provider = (process.env.PAYMENT_GATEWAY_PROVIDER || "STRIPE").toUpperCase();

  switch (provider) {
    case "STRIPE":
      return new StripeAdapter();
    case "RAZORPAY":
      return new RazorpayAdapter();
    case "PHONEPE":
      return new PhonePeAdapter();
    default:
      console.warn(`[Payments] Unknown PAYMENT_GATEWAY_PROVIDER="${provider}", defaulting to StripeAdapter.`);
      return new StripeAdapter();
  }
}
