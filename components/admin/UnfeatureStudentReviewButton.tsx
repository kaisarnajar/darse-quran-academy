"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { unfeatureStudentReview } from "@/app/admin/review-approvals/actions";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export function UnfeatureStudentReviewButton({ reviewId }: { reviewId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  function getReturnTo() {
    const query = searchParams.toString();
    return query ? `${pathname}?${query}` : pathname;
  }

  function handleClick() {
    if (!window.confirm("Remove this review from the homepage?")) return;

    startTransition(async () => {
      try {
        const result = await unfeatureStudentReview(reviewId, getReturnTo());
        if (result?.error) {
          window.alert(result.error);
          return;
        }
      } catch (error) {
        if (!isRedirectError(error)) {
          window.alert("Could not update review. Please try again.");
        }
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="text-xs font-semibold text-muted hover:text-red-700 disabled:opacity-60"
    >
      {pending ? "…" : "Remove from homepage"}
    </button>
  );
}
