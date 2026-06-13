import Link from "next/link";
import { ApproveStudentReviewButton } from "@/components/admin/ApproveStudentReviewButton";
import { RejectStudentReviewButton } from "@/components/admin/RejectStudentReviewButton";
import { StarRating } from "@/components/reviews/StarRating";
import {
  HOMEPAGE_FEATURED_REVIEWS_MAX,
  getApprovedStudentReviewsForAdmin,
  getFeaturedHomepageReviewCount,
  getPendingStudentReviewsForAdmin,
  type StudentReviewWithUser,
} from "@/lib/student-reviews";

function formatDate(date: Date) {
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function ReviewName({ review }: { review: StudentReviewWithUser }) {
  return review.user.name ?? "—";
}

function ReviewActions({
  reviewId,
  pending = false,
}: {
  reviewId: string;
  pending?: boolean;
}) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Link href={`/admin/review-approvals/${reviewId}`} className="font-medium text-primary hover:underline">
        View
      </Link>
      <Link
        href={`/admin/review-approvals/${reviewId}/edit`}
        className="font-medium text-primary hover:underline"
      >
        Edit
      </Link>
      {pending && (
        <>
          <ApproveStudentReviewButton reviewId={reviewId} />
          <RejectStudentReviewButton reviewId={reviewId} />
        </>
      )}
    </div>
  );
}

function ReviewTable({
  reviews,
  showHomepage = false,
  pendingActions = false,
  emptyMessage,
}: {
  reviews: StudentReviewWithUser[];
  showHomepage?: boolean;
  pendingActions?: boolean;
  emptyMessage: string;
}) {
  if (reviews.length === 0) {
    return (
      <p className="px-4 py-10 text-center text-sm text-muted">{emptyMessage}</p>
    );
  }

  return (
    <table className="w-full min-w-[1040px] text-left text-sm">
      <thead className="border-b border-border bg-background/50 text-muted">
        <tr>
          <th className="px-4 py-3 font-medium">Name</th>
          <th className="px-4 py-3 font-medium">Email</th>
          <th className="px-4 py-3 font-medium">Course</th>
          <th className="px-4 py-3 font-medium">Location</th>
          <th className="px-4 py-3 font-medium">Stars</th>
          <th className="px-4 py-3 font-medium">Review</th>
          {showHomepage && <th className="px-4 py-3 font-medium">Homepage</th>}
          <th className="px-4 py-3 font-medium">Submitted</th>
          <th className="px-4 py-3 font-medium" />
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {reviews.map((review) => (
          <tr key={review.id}>
            <td className="px-4 py-3 font-medium text-foreground">
              <ReviewName review={review} />
            </td>
            <td className="px-4 py-3 text-muted">{review.user.email}</td>
            <td className="px-4 py-3 text-muted">{review.course?.trim() || "Darse Quran Academy"}</td>
            <td className="px-4 py-3 text-muted">{review.location?.trim() || "—"}</td>
            <td className="px-4 py-3">
              <StarRating rating={review.rating} size="sm" />
            </td>
            <td className="max-w-xs px-4 py-3 text-muted">
              <p className="line-clamp-2">&ldquo;{review.quote}&rdquo;</p>
            </td>
            {showHomepage && (
              <td className="px-4 py-3 text-muted">
                {review.featuredOnHomepage ? "Featured" : "Not featured"}
              </td>
            )}
            <td className="px-4 py-3 text-muted">{formatDate(review.createdAt)}</td>
            <td className="whitespace-nowrap px-4 py-3">
              <ReviewActions reviewId={review.id} pending={pendingActions} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default async function AdminReviewApprovalsPage({
  searchParams,
}: {
  searchParams: Promise<{ approved?: string; rejected?: string; unfeatured?: string; featured?: string; saved?: string }>;
}) {
  const params = await searchParams;
  const [pendingReviews, approvedReviews, featuredCount] = await Promise.all([
    getPendingStudentReviewsForAdmin(),
    getApprovedStudentReviewsForAdmin(),
    getFeaturedHomepageReviewCount(),
  ]);

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-primary">Review approvals</h1>
      <p className="mt-1 text-sm text-muted">
        Approve student reviews before they can appear on the homepage. Removing from the homepage does not
        delete a review — manage all approved reviews below.
      </p>

      {params.approved === "1" && (
        <p className="mt-4 rounded-md bg-violet-50 px-4 py-3 text-sm text-violet-800">Review updated.</p>
      )}
      {params.rejected === "1" && (
        <p className="mt-4 rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Review rejected. The student can edit and resubmit.
        </p>
      )}
      {params.unfeatured === "1" && (
        <p className="mt-4 rounded-md bg-violet-50 px-4 py-3 text-sm text-violet-800">
          Review removed from the homepage.
        </p>
      )}
      {params.featured === "1" && (
        <p className="mt-4 rounded-md bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          Review added to the homepage.
        </p>
      )}
      {params.saved === "1" && (
        <p className="mt-4 rounded-md bg-violet-50 px-4 py-3 text-sm text-violet-800">Changes saved.</p>
      )}

      <section className="mt-10">
        <h2 className="font-serif text-lg font-semibold text-foreground">
          Pending approval
          {pendingReviews.length > 0 && (
            <span className="ml-2 inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-900">
              {pendingReviews.length}
            </span>
          )}
        </h2>
        <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-surface">
          <ReviewTable
            reviews={pendingReviews}
            pendingActions
            emptyMessage="No student reviews awaiting approval."
          />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-lg font-semibold text-foreground">
          On homepage
          <span className="ml-2 text-sm font-normal text-muted">
            ({featuredCount}/{HOMEPAGE_FEATURED_REVIEWS_MAX})
          </span>
        </h2>
        <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-surface">
          <ReviewTable
            reviews={featuredReviews}
            showHomepage
            emptyMessage="No reviews on the homepage yet. Approve submissions above or add one from All reviews."
          />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-lg font-semibold text-foreground">
          All reviews
          <span className="ml-2 text-sm font-normal text-muted">({approvedReviews.length} approved)</span>
        </h2>
        <p className="mt-1 text-sm text-muted">
          Every approved review stays here. Use Edit to add or remove homepage visibility.
        </p>
        <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-surface">
          <ReviewTable
            reviews={approvedReviews}
            showHomepage
            emptyMessage="No approved reviews yet."
          />
        </div>
      </section>
    </div>
  );
}
