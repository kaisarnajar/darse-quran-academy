import { unstable_noStore as noStore } from "next/cache";
import {
  MONTHLY_PAYMENT_APPROVED,
  MONTHLY_PAYMENT_DECLINED,
  MONTHLY_PAYMENT_PENDING,
} from "@/lib/monthly-payment-status";
import { prisma } from "@/lib/prisma";

export type CoursePaymentSubmissionWithUser = {
  id: string;
  userId: string;
  courseId: string;
  label: string;
  amountInrPaise: number;
  status: string;
  paymentMethod: string | null;
  upiTransactionId: string | null;
  paymentScreenshotPath: string | null;
  paymentReference: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
};

export async function getPendingMonthlyPayments(): Promise<CoursePaymentSubmissionWithUser[]> {
  noStore();
  return prisma.coursePaymentSubmission.findMany({
    where: { status: MONTHLY_PAYMENT_PENDING },
    orderBy: { updatedAt: "desc" },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });
}

export async function getPendingMonthlyPaymentCount(): Promise<number> {
  noStore();
  return prisma.coursePaymentSubmission.count({
    where: { status: MONTHLY_PAYMENT_PENDING },
  });
}

export async function getUserPaymentSubmissions(userId: string) {
  return prisma.coursePaymentSubmission.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getUserActiveEnrollmentForCourse(userId: string, courseId: string) {
  return prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
}

/** How many calendar years before the current year students may select. */
export const PAYMENT_YEARS_BACK = 2;

/** How many calendar years after the current year students may select (e.g. 2035, 2040). */
export const PAYMENT_YEARS_FORWARD = 25;

export function getPaymentYearBounds(referenceDate = new Date()) {
  const current = referenceDate.getFullYear();
  return {
    min: current - PAYMENT_YEARS_BACK,
    max: current + PAYMENT_YEARS_FORWARD,
  };
}

export function getPaymentYearOptions(referenceDate = new Date()): string[] {
  const { min, max } = getPaymentYearBounds(referenceDate);
  const years: string[] = [];
  for (let y = min; y <= max; y++) {
    years.push(String(y));
  }
  return years;
}

export function isPaymentYearAllowed(year: string, referenceDate = new Date()): boolean {
  const y = Number.parseInt(year, 10);
  if (!Number.isFinite(y) || year.length !== 4) return false;
  const { min, max } = getPaymentYearBounds(referenceDate);
  return y >= min && y <= max;
}

export function buildMonthlyFeeLabel(month: string, year: string): string {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const index = Number.parseInt(month, 10) - 1;
  const monthName = monthNames[index] ?? month;
  return `Monthly fee — ${monthName} ${year}`;
}

export { MONTHLY_PAYMENT_APPROVED, MONTHLY_PAYMENT_DECLINED, MONTHLY_PAYMENT_PENDING };
