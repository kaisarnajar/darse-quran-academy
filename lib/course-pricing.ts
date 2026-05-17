import type { CourseLevel } from "@/lib/courses";

export type CoursePricing = {
  registrationFeePaise: number;
  registrationFeeInr: number;
  monthlyFeeInr: number;
};

const PRICING_BY_LEVEL: Record<CourseLevel, CoursePricing> = {
  Beginner: {
    registrationFeePaise: 9900,
    registrationFeeInr: 99,
    monthlyFeeInr: 349,
  },
  Intermediate: {
    registrationFeePaise: 19900,
    registrationFeeInr: 199,
    monthlyFeeInr: 499,
  },
  Advanced: {
    registrationFeePaise: 19900,
    registrationFeeInr: 199,
    monthlyFeeInr: 499,
  },
};

export function isCourseLevel(level: string): level is CourseLevel {
  return level in PRICING_BY_LEVEL;
}

export function getCoursePricing(level: string): CoursePricing {
  if (isCourseLevel(level)) return PRICING_BY_LEVEL[level];
  return PRICING_BY_LEVEL.Beginner;
}

export function getRegistrationFeePaise(level: string): number {
  return getCoursePricing(level).registrationFeePaise;
}

export const COURSE_PRICING_SUMMARY =
  "Registration fee: ₹99 (Beginner) or ₹199 (Intermediate & Advanced). Monthly fee: ₹349 or ₹499 per month, by level.";
