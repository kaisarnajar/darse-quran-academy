"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth-actions";
import { prisma } from "@/lib/prisma";
import { HOMEPAGE_FEATURED_REVIEWS_MAX, getFeaturedHomepageReviewCount } from "@/lib/student-reviews";

function revalidateReviewPaths(reviewId?: string) {
  revalidatePath("/");
  revalidatePath("/profile/reviews");
  revalidatePath("/admin/review-approvals");
  if (reviewId) {
    revalidatePath(`/admin/review-approvals/${reviewId}`);
    revalidatePath(`/admin/review-approvals/${reviewId}/edit`);
  }
}

function returnUrl(
  returnTo: string | undefined,
  event: "approved" | "rejected" | "unfeatured" | "featured",
): string {
  const param =
    event === "approved"
      ? "approved"
      : event === "rejected"
        ? "rejected"
        : event === "featured"
          ? "featured"
          : "unfeatured";
  const fallback = `/admin/review-approvals?${param}=1`;
  if (!returnTo?.startsWith("/admin")) return fallback;
  const [pathname, query = ""] = returnTo.split("?");
  const params = new URLSearchParams(query);
  params.set(param, "1");
  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : `${pathname}?${param}=1`;
}

export async function approveStudentReview(
  reviewId: string,
  featureOnHomepage: boolean,
  returnTo?: string,
): Promise<{ error?: string }> {
  await requireAdmin();

  const review = await prisma.studentReview.findUnique({ where: { id: reviewId } });
  if (!review) return { error: "Review not found." };
  if (review.status !== "PENDING") {
    return { error: "This review is no longer pending approval." };
  }

  let featuredOnHomepage = false;
  let featuredAt: Date | null = null;

  if (featureOnHomepage) {
    const featuredCount = await getFeaturedHomepageReviewCount();
    if (featuredCount >= HOMEPAGE_FEATURED_REVIEWS_MAX) {
      return {
        error: `The homepage already has ${HOMEPAGE_FEATURED_REVIEWS_MAX} reviews. Remove one before adding another.`,
      };
    }
    featuredOnHomepage = true;
    featuredAt = new Date();
  }

  await prisma.studentReview.update({
    where: { id: reviewId },
    data: {
      status: "APPROVED",
      featuredOnHomepage,
      featuredAt,
    },
  });

  revalidateReviewPaths(reviewId);
  redirect(returnUrl(returnTo, "approved"));
}

export async function rejectStudentReview(
  reviewId: string,
  returnTo?: string,
): Promise<{ error?: string }> {
  await requireAdmin();

  const review = await prisma.studentReview.findUnique({ where: { id: reviewId } });
  if (!review) return { error: "Review not found." };
  if (review.status !== "PENDING") {
    return { error: "This review is no longer pending approval." };
  }

  await prisma.studentReview.update({
    where: { id: reviewId },
    data: {
      status: "REJECTED",
      featuredOnHomepage: false,
      featuredAt: null,
    },
  });

  revalidateReviewPaths(reviewId);
  redirect(returnUrl(returnTo, "rejected"));
}

export async function unfeatureStudentReview(
  reviewId: string,
  returnTo?: string,
): Promise<{ error?: string }> {
  await requireAdmin();

  const review = await prisma.studentReview.findUnique({ where: { id: reviewId } });
  if (!review) return { error: "Review not found." };

  await prisma.studentReview.update({
    where: { id: reviewId },
    data: {
      featuredOnHomepage: false,
      featuredAt: null,
    },
  });

  revalidateReviewPaths(reviewId);
  redirect(returnUrl(returnTo, "unfeatured"));
}

export async function featureStudentReview(
  reviewId: string,
  returnTo?: string,
): Promise<{ error?: string }> {
  await requireAdmin();

  const review = await prisma.studentReview.findUnique({ where: { id: reviewId } });
  if (!review) return { error: "Review not found." };
  if (review.status !== "APPROVED") {
    return { error: "Only approved reviews can be shown on the homepage." };
  }

  const featuredCount = await getFeaturedHomepageReviewCount();
  if (!review.featuredOnHomepage && featuredCount >= HOMEPAGE_FEATURED_REVIEWS_MAX) {
    return {
      error: `The homepage already has ${HOMEPAGE_FEATURED_REVIEWS_MAX} reviews. Remove one first.`,
    };
  }

  await prisma.studentReview.update({
    where: { id: reviewId },
    data: {
      featuredOnHomepage: true,
      featuredAt: new Date(),
    },
  });

  revalidateReviewPaths(reviewId);
  redirect(returnUrl(returnTo, "featured"));
}

export async function saveApprovedReviewHomepageSetting(
  reviewId: string,
  formData: FormData,
  returnTo?: string,
): Promise<{ error?: string }> {
  await requireAdmin();

  const review = await prisma.studentReview.findUnique({ where: { id: reviewId } });
  if (!review) return { error: "Review not found." };
  if (review.status !== "APPROVED") {
    return { error: "Only approved reviews can update homepage settings." };
  }

  const featureOnHomepage = formData.get("featuredOnHomepage") === "on";

  if (featureOnHomepage && !review.featuredOnHomepage) {
    const featuredCount = await getFeaturedHomepageReviewCount();
    if (featuredCount >= HOMEPAGE_FEATURED_REVIEWS_MAX) {
      return {
        error: `The homepage already has ${HOMEPAGE_FEATURED_REVIEWS_MAX} reviews. Remove one first.`,
      };
    }

    await prisma.studentReview.update({
      where: { id: reviewId },
      data: { featuredOnHomepage: true, featuredAt: new Date() },
    });

    revalidateReviewPaths(reviewId);
    redirect(returnUrl(returnTo, "featured"));
  }

  if (!featureOnHomepage && review.featuredOnHomepage) {
    await prisma.studentReview.update({
      where: { id: reviewId },
      data: { featuredOnHomepage: false, featuredAt: null },
    });

    revalidateReviewPaths(reviewId);
    redirect(returnUrl(returnTo, "unfeatured"));
  }

  redirect(`/admin/review-approvals/${reviewId}/edit?saved=1`);
}
