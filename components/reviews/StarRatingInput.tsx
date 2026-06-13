"use client";

import { useState } from "react";
import { REVIEW_RATING_MAX } from "@/lib/review-rating";
import { labelClassName } from "@/lib/form";

type StarRatingInputProps = {
  name?: string;
  initialRating?: number;
  required?: boolean;
  onChange?: (rating: number) => void;
};

export function StarRatingInput({
  name = "rating",
  initialRating = 0,
  required = true,
  onChange,
}: StarRatingInputProps) {
  const [rating, setRating] = useState(initialRating > 0 ? initialRating : 0);
  const [hoverRating, setHoverRating] = useState(0);
  const displayRating = hoverRating || rating;

  function selectRating(starValue: number) {
    setRating(starValue);
    onChange?.(starValue);
  }

  return (
    <div>
      <span className={labelClassName}>
        Your rating <span className="text-red-600">*</span>
      </span>
      <input type="hidden" name={name} value={rating || ""} required={required} />
      <div
        className="mt-1 flex items-center gap-1"
        role="radiogroup"
        aria-label="Rate from 1 to 5 stars"
        onMouseLeave={() => setHoverRating(0)}
      >
        {Array.from({ length: REVIEW_RATING_MAX }).map((_, index) => {
          const starValue = index + 1;
          const filled = starValue <= displayRating;

          return (
            <button
              key={starValue}
              type="button"
              role="radio"
              aria-checked={rating === starValue}
              aria-label={`${starValue} star${starValue === 1 ? "" : "s"}`}
              onMouseEnter={() => setHoverRating(starValue)}
              onClick={() => selectRating(starValue)}
              className="rounded p-0.5 text-gold transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <svg
                className={`h-8 w-8 ${filled ? "fill-current" : "fill-none stroke-current"}`}
                viewBox="0 0 20 20"
                aria-hidden
              >
                <path
                  strokeWidth={filled ? 0 : 1.2}
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
            </button>
          );
        })}
        <span className="ml-2 text-sm text-muted">
          {rating > 0 ? `${rating} / ${REVIEW_RATING_MAX}` : "Select a rating"}
        </span>
      </div>
    </div>
  );
}
