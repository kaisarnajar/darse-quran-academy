export const REVIEW_RATING_MIN = 1;
export const REVIEW_RATING_MAX = 5;

export function isValidReviewRating(value: number): boolean {
  return Number.isInteger(value) && value >= REVIEW_RATING_MIN && value <= REVIEW_RATING_MAX;
}

export function clampReviewRating(value: number): number {
  return Math.min(REVIEW_RATING_MAX, Math.max(REVIEW_RATING_MIN, value));
}
