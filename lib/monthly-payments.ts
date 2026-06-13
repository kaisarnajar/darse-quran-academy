import { unstable_noStore as noStore } from "next/cache";
import {
  MONTHLY_PAYMENT_APPROVED,
  MONTHLY_PAYMENT_DECLINED,
  MONTHLY_PAYMENT_PENDING,
  PAYMENT_TYPE_ENROLLMENT,
  PAYMENT_TYPE_MONTHLY,
} from "@/lib/monthly-payment-status";
import { prisma } from "@/lib/prisma";

export type CoursePaymentSubmissionWithUser = {
  id: string;
  userId: string;
  courseId: string;
  paymentType: string;
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

export type ApprovedPaymentWithRecord = CoursePaymentSubmissionWithUser & {
  paymentRecordId: string;
  receiptEmailSentAt: Date | null;
};

export async function getApprovedMonthlyPaymentsForReceipt(): Promise<ApprovedPaymentWithRecord[]> {
  noStore();
  const rows = await prisma.coursePaymentSubmission.findMany({
    where: { status: MONTHLY_PAYMENT_APPROVED, paymentRecordId: { not: null } },
    orderBy: { updatedAt: "desc" },
    take: 50,
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });

  const recordIds = rows
    .map((row) => row.paymentRecordId)
    .filter((id): id is string => Boolean(id));

  const records =
    recordIds.length > 0
      ? await prisma.paymentRecord.findMany({
          where: { id: { in: recordIds } },
          select: { id: true, receiptEmailSentAt: true },
        })
      : [];

  const receiptByRecordId = new Map(records.map((r) => [r.id, r.receiptEmailSentAt]));

  return rows
    .filter((row): row is typeof row & { paymentRecordId: string } => Boolean(row.paymentRecordId))
    .map((row) => ({
      ...row,
      paymentRecordId: row.paymentRecordId,
      receiptEmailSentAt: receiptByRecordId.get(row.paymentRecordId) ?? null,
    }));
}

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

export function buildEnrollmentFeeLabel(courseTitle: string): string {
  return `Enrollment fee — ${courseTitle}`;
}

export async function hasPendingEnrollmentFeeSubmission(
  userId: string,
  courseId: string,
): Promise<boolean> {
  const submission = await prisma.coursePaymentSubmission.findFirst({
    where: {
      userId,
      courseId,
      paymentType: PAYMENT_TYPE_ENROLLMENT,
      status: MONTHLY_PAYMENT_PENDING,
    },
    select: { id: true },
  });
  return Boolean(submission);
}

export async function getPendingEnrollmentFeeSubmissionMap(userId: string) {
  const rows = await prisma.coursePaymentSubmission.findMany({
    where: {
      userId,
      paymentType: PAYMENT_TYPE_ENROLLMENT,
      status: MONTHLY_PAYMENT_PENDING,
    },
    select: { courseId: true },
  });
  return new Set(rows.map((row) => row.courseId));
}

export {
  MONTHLY_PAYMENT_APPROVED,
  MONTHLY_PAYMENT_DECLINED,
  MONTHLY_PAYMENT_PENDING,
  PAYMENT_TYPE_ENROLLMENT,
  PAYMENT_TYPE_MONTHLY,
};
