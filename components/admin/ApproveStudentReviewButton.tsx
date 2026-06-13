"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { approveStudentReview } from "@/app/admin/review-approvals/actions";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export function ApproveStudentReviewButton({ reviewId }: { reviewId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [hidden, setHidden] = useState(false);
  const [pending, startTransition] = useTransition();

  if (hidden) return null;

  function getReturnTo() {
    const query = searchParams.toString();
    return query ? `${pathname}?${query}` : pathname;
  }

  function handleApprove() {
    if (!window.confirm("Approve this student review?")) return;

    startTransition(async () => {
      try {
        const result = await approveStudentReview(reviewId, false, getReturnTo());
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
        window.alert("Could not approve review. Please try again.");
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleApprove}
      disabled={pending}
      className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-light disabled:opacity-60"
    >
      {pending ? "…" : "Approve"}
    </button>
  );
}
