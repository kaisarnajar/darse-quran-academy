"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { confirmEnrollmentPayment } from "@/app/admin/enrollments/actions";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export function ConfirmPaymentButton({
  enrollmentId,
  courseId,
}: {
  enrollmentId: string;
  courseId: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [hidden, setHidden] = useState(false);
  const [pending, startTransition] = useTransition();

  if (hidden) {
    return null;
  }

  function getReturnTo() {
    const query = searchParams.toString();
    return query ? `${pathname}?${query}` : pathname;
  }

  function handleConfirm() {
    if (!window.confirm("Confirm this payment and activate enrollment?")) return;

    startTransition(async () => {
      try {
        const result = await confirmEnrollmentPayment(enrollmentId, courseId, getReturnTo());
        if (result?.error) {
          window.alert(result.error);
          return;
        }
        setHidden(true);
      } catch (error) {
        if (isRedirectError(error)) {
          setHidden(true);
          return;
        }
        window.alert("Could not confirm payment. Please try again.");
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleConfirm}
      disabled={pending}
      className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-light disabled:opacity-60"
    >
      {pending ? "…" : "Confirm payment"}
    </button>
  );
}
