import { PaymentDetailsPanel } from "@/components/payment/PaymentDetailsPanel";

export default function ProfilePaymentInfoPage() {
  return (
    <div>
      <h2 className="font-serif text-lg font-semibold text-foreground">Payment information</h2>
      <p className="mt-1 text-sm text-muted">
        Use these UPI or bank details when paying your monthly course fees. After paying, submit the
        transaction reference from your course page or the Payments tab.
      </p>
      <div className="mx-auto mt-6 max-w-5xl">
        <PaymentDetailsPanel />
      </div>
    </div>
  );
}
