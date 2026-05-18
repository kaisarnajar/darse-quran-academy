"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { declineEnrollmentPayment } from "@/app/admin/enrollments/actions";

export function DeclinePaymentButton({
  enrollmentId,
  courseId,
}: {
  enrollmentId: string;
  courseId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDecline() {
    if (
      !window.confirm(
        "Decline this payment? The student will need to submit payment details again.",
      )
    ) {
      return;
    }

    setLoading(true);
    const result = await declineEnrollmentPayment(enrollmentId, courseId);
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
      onClick={handleDecline}
      disabled={loading}
      className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-800 hover:bg-red-100 disabled:opacity-60"
    >
      {loading ? "…" : "Decline payment"}
    </button>
  );
}
