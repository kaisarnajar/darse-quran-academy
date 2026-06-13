"use client";

import { useState } from "react";
import { createStudentReview, updateStudentReview } from "@/app/profile/reviews/actions";
import type { StudentReview } from "@prisma/client";
import { StarRatingInput } from "@/components/reviews/StarRatingInput";
import { inputClassName, labelClassName } from "@/lib/form";

type StudentReviewFormProps = {
  review?: Pick<StudentReview, "id" | "quote" | "course" | "location" | "rating">;
  defaultLocation?: string | null;
};

export function StudentReviewForm({ review, defaultLocation }: StudentReviewFormProps) {
  const action = review ? updateStudentReview.bind(null, review.id) : createStudentReview;
  const [rating, setRating] = useState(review?.rating ?? 0);

  return (
    <form action={action} className="space-y-4 rounded-lg border border-border bg-surface p-5">
      <StarRatingInput initialRating={review?.rating ?? 0} onChange={setRating} />

      <div>
        <label htmlFor="quote" className={labelClassName}>
          Your review <span className="text-red-600">*</span>
        </label>
        <textarea
          id="quote"
          name="quote"
          required
          rows={5}
          maxLength={1000}
          defaultValue={review?.quote ?? ""}
          placeholder="Share your experience learning with Darse Quran Academy…"
          className={inputClassName}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="course" className={labelClassName}>
            Course (optional)
          </label>
          <input
            id="course"
            name="course"
            maxLength={120}
            defaultValue={review?.course ?? ""}
            placeholder="e.g. Tajweed, Hifz"
            className={inputClassName}
          />
        </div>
        <div>
          <label htmlFor="location" className={labelClassName}>
            Location (optional)
          </label>
          <input
            id="location"
            name="location"
            maxLength={120}
            defaultValue={review?.location ?? defaultLocation ?? ""}
            placeholder="e.g. Srinagar, J&K"
            className={inputClassName}
          />
        </div>
      </div>

      <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-900">
        Your review will be sent to the admin for verification. If approved, it may appear on the
        homepage (up to six student reviews are shown at a time).
      </p>

      <button
        type="submit"
        disabled={rating < 1}
        className="min-h-11 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60"
      >
        {review ? "Resubmit for approval" : "Submit review"}
      </button>
    </form>
  );
}
