"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { featureStudentReview } from "@/app/admin/review-approvals/actions";
import { isRedirectError } from "next/dist/client/components/redirect-error";

type FeatureStudentReviewButtonProps = {
  reviewId: string;
  disabled?: boolean;
  disabledReason?: string;
};

export function FeatureStudentReviewButton({
  reviewId,
  disabled = false,
  disabledReason,
}: FeatureStudentReviewButtonProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  function getReturnTo() {
    const query = searchParams.toString();
    return query ? `${pathname}?${query}` : pathname;
  }

  function handleClick() {
    if (disabled) {
      if (disabledReason) window.alert(disabledReason);
      return;
    }
    if (!window.confirm("Show this review on the homepage?")) return;

    startTransition(async () => {
      try {
        const result = await featureStudentReview(reviewId, getReturnTo());
        if (result?.error) {
          window.alert(result.error);
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
      disabled={pending || disabled}
      className="rounded-md border border-primary px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-60"
      title={disabled ? disabledReason : undefined}
    >
      {pending ? "…" : "Add to homepage"}
    </button>
  );
}
