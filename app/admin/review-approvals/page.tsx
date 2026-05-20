import Link from "next/link";
import { ApproveStudentReviewForm } from "@/components/admin/ApproveStudentReviewForm";
import { FeatureStudentReviewButton } from "@/components/admin/FeatureStudentReviewButton";
import { UnfeatureStudentReviewButton } from "@/components/admin/UnfeatureStudentReviewButton";
import {
  HOMEPAGE_FEATURED_REVIEWS_MAX,
  getApprovedStudentReviewsForAdmin,
  getFeaturedHomepageReviewCount,
  getFeaturedStudentReviewsForAdmin,
  getPendingStudentReviewsForAdmin,
  toHomepageReview,
} from "@/lib/student-reviews";

function ReviewCard({
  display,
  children,
}: {
  display: ReturnType<typeof toHomepageReview>;
  children: React.ReactNode;
}) {
  return (
    <li className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="font-medium text-foreground">{display.name}</p>
        <p className="text-xs text-muted">
          {display.course} · {display.location}
        </p>
        <p className="mt-2 text-sm text-foreground">&ldquo;{display.quote}&rdquo;</p>
      </div>
      <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">{children}</div>
    </li>
  );
}

export default async function AdminReviewApprovalsPage({
  searchParams,
}: {
  searchParams: Promise<{ approved?: string; rejected?: string; unfeatured?: string; featured?: string }>;
}) {
  const params = await searchParams;
  const [pendingReviews, featuredReviews, approvedReviews, featuredCount] = await Promise.all([
    getPendingStudentReviewsForAdmin(),
    getFeaturedStudentReviewsForAdmin(),
    getApprovedStudentReviewsForAdmin(),
    getFeaturedHomepageReviewCount(),
  ]);

  const canFeatureMore = featuredCount < HOMEPAGE_FEATURED_REVIEWS_MAX;
  const homepageFullMessage = `The homepage already has ${HOMEPAGE_FEATURED_REVIEWS_MAX} reviews. Remove one from the homepage first.`;

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-primary">Review approvals</h1>
      <p className="mt-1 text-sm text-muted">
        Approve student reviews before they can appear on the{" "}
        <Link href="/" className="font-medium text-primary hover:underline">
          homepage
        </Link>
        . Removing from the homepage does not delete a review — manage all approved reviews below.
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
          Review removed from the homepage. It is still listed under All reviews.
        </p>
      )}
      {params.featured === "1" && (
        <p className="mt-4 rounded-md bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          Review added to the homepage.
        </p>
      )}

      <section className="mt-10">
        <h2 className="font-serif text-lg font-semibold text-foreground">
          On homepage
          <span className="ml-2 text-sm font-normal text-muted">
            ({featuredCount}/{HOMEPAGE_FEATURED_REVIEWS_MAX})
          </span>
        </h2>
        {featuredReviews.length === 0 ? (
          <p className="mt-4 rounded-lg border border-border bg-surface px-4 py-8 text-center text-sm text-muted">
            No reviews on the homepage yet. Approve submissions below or add one from All reviews.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {featuredReviews.map((review) => {
              const display = toHomepageReview(review);
              return (
                <ReviewCard key={review.id} display={display}>
                  <UnfeatureStudentReviewButton reviewId={review.id} />
                </ReviewCard>
              );
            })}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-lg font-semibold text-foreground">
          All reviews
          <span className="ml-2 text-sm font-normal text-muted">({approvedReviews.length} approved)</span>
        </h2>
        <p className="mt-1 text-sm text-muted">
          Every approved review stays here. Use Add to homepage or Remove from homepage anytime.
        </p>
        {approvedReviews.length === 0 ? (
          <p className="mt-4 rounded-lg border border-border bg-surface px-4 py-8 text-center text-sm text-muted">
            No approved reviews yet.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {approvedReviews.map((review) => {
              const display = toHomepageReview(review);
              return (
                <ReviewCard key={review.id} display={display}>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      review.featuredOnHomepage
                        ? "bg-violet-100 text-violet-900"
                        : "bg-stone-200 text-stone-800"
                    }`}
                  >
                    {review.featuredOnHomepage ? "On homepage" : "Not on homepage"}
                  </span>
                  {review.featuredOnHomepage ? (
                    <UnfeatureStudentReviewButton reviewId={review.id} />
                  ) : (
                    <FeatureStudentReviewButton
                      reviewId={review.id}
                      disabled={!canFeatureMore}
                      disabledReason={homepageFullMessage}
                    />
                  )}
                </ReviewCard>
              );
            })}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-lg font-semibold text-foreground">
          Pending approval
          {pendingReviews.length > 0 && (
            <span className="ml-2 inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-900">
              {pendingReviews.length}
            </span>
          )}
        </h2>

        <div className="mt-4 space-y-4">
          {pendingReviews.length === 0 ? (
            <p className="rounded-lg border border-border bg-surface px-4 py-8 text-center text-sm text-muted">
              No student reviews awaiting approval.
            </p>
          ) : (
            pendingReviews.map((review) => (
              <article
                key={review.id}
                className="rounded-lg border border-border bg-surface p-4 sm:p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground">
                      {review.user.name ?? review.user.email}
                    </p>
                    <p className="text-xs text-muted">{review.user.email}</p>
                    {(review.course || review.location) && (
                      <p className="mt-1 text-xs text-muted">
                        {[review.course, review.location].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    <blockquote className="mt-3 text-sm leading-relaxed text-foreground">
                      &ldquo;{review.quote}&rdquo;
                    </blockquote>
                    <p className="mt-2 text-xs text-muted">
                      Submitted{" "}
                      {review.createdAt.toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <ApproveStudentReviewForm
                    reviewId={review.id}
                    featuredCount={featuredCount}
                    canFeature={canFeatureMore}
                  />
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
