"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { confirmEnrollmentPayment } from "@/app/admin/enrollments/actions";

export function ConfirmPaymentButton({
  enrollmentId,
  courseId,
}: {
  enrollmentId: string;
  courseId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    if (!window.confirm("Confirm this UPI payment and activate enrollment?")) return;

    setLoading(true);
    const result = await confirmEnrollmentPayment(enrollmentId, courseId);
    setLoading(false);

    if (result.error) {
      window.alert(result.error);
      return;
    }

    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleConfirm}
      disabled={loading}
      className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-light disabled:opacity-60"
    >
      {loading ? "…" : "Confirm payment"}
    </button>
  );
}
