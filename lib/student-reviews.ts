import type { StudentReview, StudentReviewStatus, User } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const HOMEPAGE_FEATURED_REVIEWS_MAX = 6;

export type StudentReviewWithUser = StudentReview & {
  user: Pick<User, "id" | "name" | "email">;
};

export type HomepageReview = {
  id: string;
  quote: string;
  course: string;
  location: string;
  name: string;
  initials: string;
  rating: number;
};

export function reviewStatusLabel(status: StudentReviewStatus): string {
  switch (status) {
    case "PENDING":
      return "Pending approval";
    case "APPROVED":
      return "Approved";
    case "REJECTED":
      return "Rejected";
    default:
      return status;
  }
}

export function reviewStatusClass(status: StudentReviewStatus): string {
  if (status === "PENDING") return "bg-amber-100 text-amber-900";
  if (status === "REJECTED") return "bg-red-100 text-red-900";
  return "bg-emerald-100 text-emerald-900";
}

export function getInitialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

export function toHomepageReview(review: StudentReviewWithUser): HomepageReview {
  const name = review.user.name?.trim() || "Student";
  return {
    id: review.id,
    quote: review.quote,
    course: review.course?.trim() || "Darse Quran Academy",
    location: review.location?.trim() || "—",
    name,
    initials: getInitialsFromName(name),
    rating: review.rating,
  };
}

export function canStudentEditReview(
  review: Pick<StudentReview, "status" | "userId">,
  userId: string,
): boolean {
  return review.userId === userId && (review.status === "PENDING" || review.status === "REJECTED");
}

/** Students may delete their own reviews at any approval stage. */
export function canStudentDeleteReview(
  review: Pick<StudentReview, "userId">,
  userId: string,
): boolean {
  return review.userId === userId;
}

export async function getFeaturedHomepageReviews(): Promise<HomepageReview[]> {
  const reviews = await prisma.studentReview.findMany({
    where: { status: "APPROVED", featuredOnHomepage: true },
    orderBy: [{ featuredAt: "desc" }, { updatedAt: "desc" }],
    take: HOMEPAGE_FEATURED_REVIEWS_MAX,
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });

  return reviews.map(toHomepageReview);
}

export async function getFeaturedHomepageReviewCount(): Promise<number> {
  return prisma.studentReview.count({
    where: { status: "APPROVED", featuredOnHomepage: true },
  });
}

export async function getPendingStudentReviewCount(): Promise<number> {
  return prisma.studentReview.count({ where: { status: "PENDING" } });
}

export async function getPendingStudentReviewsForAdmin() {
  return prisma.studentReview.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });
}

/** All approved reviews (homepage and not), for admin management. */
export async function getApprovedStudentReviewsForAdmin() {
  return prisma.studentReview.findMany({
    where: { status: "APPROVED" },
    orderBy: [{ featuredOnHomepage: "desc" }, { featuredAt: "desc" }, { updatedAt: "desc" }],
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });
}

export async function getStudentReviewsForUser(userId: string) {
  return prisma.studentReview.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getStudentReviewForUser(id: string, userId: string) {
  return prisma.studentReview.findFirst({
    where: { id, userId },
  });
}

export async function getStudentReviewForAdmin(id: string) {
  return prisma.studentReview.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });
}

