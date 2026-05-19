import type { CourseLevel } from "@/lib/courses";

export type CoursePricing = {
  registrationFeePaise: number;
  registrationFeeInr: number;
  monthlyFeeInr: number;
  monthlyFeePaise: number;
};

const PRICING_BY_LEVEL: Record<CourseLevel, CoursePricing> = {
  Beginner: {
    registrationFeePaise: 0,
    registrationFeeInr: 0,
    monthlyFeeInr: 349,
    monthlyFeePaise: 34900,
  },
  Intermediate: {
    registrationFeePaise: 0,
    registrationFeeInr: 0,
    monthlyFeeInr: 499,
    monthlyFeePaise: 49900,
  },
  Advanced: {
    registrationFeePaise: 0,
    registrationFeeInr: 0,
    monthlyFeeInr: 499,
    monthlyFeePaise: 49900,
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

export function getMonthlyFeePaise(level: string): number {
  return getCoursePricing(level).monthlyFeePaise;
}
