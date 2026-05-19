"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import {
  approveStudentReview,
  rejectStudentReview,
} from "@/app/admin/review-approvals/actions";
import { HOMEPAGE_FEATURED_REVIEWS_MAX } from "@/lib/student-reviews";
import { isRedirectError } from "next/dist/client/components/redirect-error";

type ApproveStudentReviewFormProps = {
  reviewId: string;
  featuredCount: number;
  canFeature: boolean;
};

export function ApproveStudentReviewForm({
  reviewId,
  featuredCount,
  canFeature,
}: ApproveStudentReviewFormProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [featureOnHomepage, setFeatureOnHomepage] = useState(canFeature);
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
        const result = await approveStudentReview(reviewId, featureOnHomepage, getReturnTo());
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

  function handleReject() {
    if (!window.confirm("Reject this review? The student can edit and resubmit.")) return;

    startTransition(async () => {
      try {
        const result = await rejectStudentReview(reviewId, getReturnTo());
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
        window.alert("Could not reject review. Please try again.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-3 sm:items-end">
      <label
        className={`flex cursor-pointer items-center gap-2 text-sm ${!canFeature ? "text-muted" : "text-foreground"}`}
      >
        <input
          type="checkbox"
          checked={featureOnHomepage}
          disabled={!canFeature || pending}
          onChange={(e) => setFeatureOnHomepage(e.target.checked)}
          className="rounded border-border"
        />
        Show on homepage ({featuredCount}/{HOMEPAGE_FEATURED_REVIEWS_MAX} slots used)
      </label>
      {!canFeature && (
        <p className="text-xs text-muted">Homepage is full. Approve without featuring, or remove a review below.</p>
      )}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleApprove}
          disabled={pending}
          className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-light disabled:opacity-60"
        >
          {pending ? "…" : "Approve"}
        </button>
        <button
          type="button"
          onClick={handleReject}
          disabled={pending}
          className="rounded-md border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-800 hover:bg-red-50 disabled:opacity-60"
        >
          Reject
        </button>
      </div>
    </div>
  );
}
