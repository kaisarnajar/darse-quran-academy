"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function PaymentConfirmForm({ enrollmentId }: { enrollmentId: string }) {
  const router = useRouter();
  const [upiTransactionId, setUpiTransactionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/payment/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enrollmentId, upiTransactionId: upiTransactionId.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not submit payment details.");
        setLoading(false);
        return;
      }

      setSuccess(data.message || "Payment submitted.");
      router.push(data.redirectUrl || "/my-courses?pending=1");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4 border-t border-border pt-8">
      <div>
        <label htmlFor="utr" className="block text-sm font-medium text-foreground">
          UPI transaction ID (UTR)
        </label>
        <p className="mt-1 text-xs text-muted">
          Find this in your Google Pay, PhonePe, or Paytm app after paying.
        </p>
        <input
          id="utr"
          type="text"
          required
          autoComplete="off"
          placeholder="e.g. 123456789012"
          value={upiTransactionId}
          onChange={(e) => setUpiTransactionId(e.target.value)}
          className="mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
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
