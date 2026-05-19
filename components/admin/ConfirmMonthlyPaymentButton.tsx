"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { confirmMonthlyPayment } from "@/app/admin/payment-approvals/actions";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export function ConfirmMonthlyPaymentButton({ submissionId }: { submissionId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [hidden, setHidden] = useState(false);
  const [pending, startTransition] = useTransition();

  if (hidden) return null;

  function getReturnTo() {
    const query = searchParams.toString();
    return query ? `${pathname}?${query}` : pathname;
  }

  function handleConfirm() {
    if (!window.confirm("Approve this monthly fee payment and record it on the student's account?")) return;

    startTransition(async () => {
      try {
        const result = await confirmMonthlyPayment(submissionId, getReturnTo());
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
        window.alert("Could not approve payment. Please try again.");
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
      {pending ? "…" : "Approve payment"}
    </button>
  );
}
