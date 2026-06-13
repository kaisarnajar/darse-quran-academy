import Link from "next/link";
import { DeleteStudentReviewButton } from "@/components/profile/DeleteStudentReviewButton";
import { StudentReviewForm } from "@/components/profile/StudentReviewForm";
import { StarRating } from "@/components/reviews/StarRating";
import { requireUser } from "@/lib/auth-actions";
import { prisma } from "@/lib/prisma";
import {
  canStudentDeleteReview,
  canStudentEditReview,
  getStudentReviewsForUser,
  reviewStatusClass,
  reviewStatusLabel,
} from "@/lib/student-reviews";

export default async function ProfileReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{
    submitted?: string;
    resubmitted?: string;
    deleted?: string;
    error?: string;
    edit?: string;
  }>;
}) {
  const params = await searchParams;
  const session = await requireUser();
  const [reviews, user] = await Promise.all([
    getStudentReviewsForUser(session.user.id),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { address: true },
    }),
  ]);

  const editingReview = params.edit
    ? reviews.find((r) => r.id === params.edit && canStudentEditReview(r, session.user.id))
    : undefined;

  return (
    <div>
      <h2 className="font-serif text-lg font-semibold text-foreground">My reviews</h2>
      <p className="mt-1 text-sm text-muted">
        Share your learning experience. Approved reviews may appear on the academy homepage. You can
        delete your own reviews anytime from Your submissions below.
      </p>

      {params.submitted === "1" && (
        <p className="mt-4 rounded-md bg-violet-50 px-4 py-3 text-sm text-violet-800">
          Thank you! Your review was submitted for admin approval.
        </p>
      )}
      {params.resubmitted === "1" && (
        <p className="mt-4 rounded-md bg-violet-50 px-4 py-3 text-sm text-violet-800">
          Your review was resubmitted for approval.
        </p>
      )}
      {params.deleted === "1" && (
        <p className="mt-4 rounded-md bg-violet-50 px-4 py-3 text-sm text-violet-800">Review deleted.</p>
      )}
      {params.error === "locked" && (
        <p className="mt-4 rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-900">
          This review can no longer be edited.
        </p>
      )}
      {params.error === "notfound" && (
        <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">Review not found.</p>
      )}
      {params.error && !["locked", "notfound"].includes(params.error) && (
        <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">
          {decodeURIComponent(params.error)}
        </p>
      )}

      {editingReview ? (
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Edit review</h3>
            <Link href="/profile/reviews" className="text-sm text-primary hover:underline">
              Cancel
            </Link>
          </div>
          <StudentReviewForm review={editingReview} defaultLocation={user?.address} />
        </div>
      ) : (
        <div className="mt-6">
          <h3 className="mb-3 text-sm font-semibold text-foreground">Write a review</h3>
          <StudentReviewForm defaultLocation={user?.address} />
        </div>
      )}

      {reviews.length > 0 && (
        <div className="mt-10">
          <h3 className="text-sm font-semibold text-foreground">Your submissions</h3>
          <ul className="mt-4 space-y-4">
            {reviews.map((review) => {
              const editable = canStudentEditReview(review, session.user.id);
              const deletable = canStudentDeleteReview(review, session.user.id);
              return (
                <li key={review.id} className="rounded-lg border border-border bg-surface p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${reviewStatusClass(review.status)}`}
                    >
                      {review.status === "APPROVED" && review.featuredOnHomepage
                        ? "On homepage"
                        : reviewStatusLabel(review.status)}
                    </span>
                    {(editable || deletable) && (
                      <div className="flex gap-3">
                        {editable && (
                          <Link
                            href={`/profile/reviews?edit=${review.id}`}
                            className="text-sm font-medium text-primary hover:underline"
                          >
                            Edit
                          </Link>
                        )}
                        {deletable && (
                          <DeleteStudentReviewButton
                            id={review.id}
                            onHomepage={review.status === "APPROVED" && review.featuredOnHomepage}
                          />
                        )}
                      </div>
                    )}
                  </div>
                  <StarRating rating={review.rating} className="mt-3" />
                  <p className="mt-2 text-sm leading-relaxed text-foreground">&ldquo;{review.quote}&rdquo;</p>
                  {(review.course || review.location) && (
                    <p className="mt-2 text-xs text-muted">
                      {[review.course, review.location].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-muted">
                    Submitted {review.createdAt.toLocaleDateString("en-IN")}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
