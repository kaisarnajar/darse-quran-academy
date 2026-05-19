"use client";

import { deleteStudentReview } from "@/app/profile/reviews/actions";

export function DeleteStudentReviewButton({ id }: { id: string }) {
  return (
    <form
      action={deleteStudentReview.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm("Delete this review? This cannot be undone.")) {
          e.preventDefault();
        }
      }}
    >
      <button type="submit" className="text-sm font-medium text-red-700 hover:underline">
        Delete
      </button>
    </form>
  );
}
