"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type PaymentMethod = "upi" | "bank";

export function PaymentConfirmForm({ enrollmentId }: { enrollmentId: string }) {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [transactionId, setTransactionId] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("enrollmentId", enrollmentId);
      formData.append("paymentMethod", paymentMethod);
      formData.append("upiTransactionId", transactionId.trim());
      if (screenshot && screenshot.size > 0) {
        formData.append("screenshot", screenshot);
      }

      const res = await fetch("/api/payment/confirm", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not submit payment details.");
        setLoading(false);
        return;
      }

      setSuccess(data.message || "Payment submitted.");
      router.push(data.redirectUrl || "/profile/courses?pending=1");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5 border-t border-border pt-8">
      <fieldset>
        <legend className="text-sm font-medium text-foreground">How did you pay?</legend>
        <div className="mt-3 flex flex-wrap gap-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="radio"
              name="paymentMethod"
              value="upi"
              checked={paymentMethod === "upi"}
              onChange={() => setPaymentMethod("upi")}
              className="text-primary"
            />
            UPI
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="radio"
              name="paymentMethod"
              value="bank"
              checked={paymentMethod === "bank"}
              onChange={() => setPaymentMethod("bank")}
              className="text-primary"
            />
            Bank transfer
          </label>
        </div>
      </fieldset>

      <div>
        <label htmlFor="utr" className="block text-sm font-medium text-foreground">
          {paymentMethod === "bank" ? "Transaction / UTR reference" : "UPI transaction ID (UTR)"}
        </label>
        <p className="mt-1 text-xs text-muted">
          {paymentMethod === "bank"
            ? "Enter the reference number from your bank app or receipt after transferring."
            : "Find this in Google Pay, PhonePe, Paytm, or your UPI app after paying."}
        </p>
        <input
          id="utr"
          type="text"
          required
          autoComplete="off"
          placeholder={paymentMethod === "bank" ? "e.g. NEFT123456789" : "e.g. 123456789012"}
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
          className="mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label htmlFor="screenshot" className="block text-sm font-medium text-foreground">
          Payment screenshot <span className="font-normal text-muted">(optional)</span>
        </label>
        <p className="mt-1 text-xs text-muted">
          Upload a screenshot of your payment confirmation to help us verify faster.
        </p>
        <input
          id="screenshot"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={(e) => setScreenshot(e.target.files?.[0] ?? null)}
          className="mt-2 w-full text-sm text-muted file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-primary-light"
        />
        {screenshot && (
          <p className="mt-1 text-xs text-muted">
            Selected: {screenshot.name} ({(screenshot.size / 1024).toFixed(0)} KB)
          </p>
        )}
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {error}
        </p>
      )}
      {success && (
        <p className="rounded-lg bg-violet-50 px-3 py-2 text-sm text-violet-800">{success}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="min-h-11 w-full rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-light disabled:opacity-60"
      >
        {loading ? "Submitting…" : "I have paid — Submit for verification"}
      </button>
    </form>
  );
}
