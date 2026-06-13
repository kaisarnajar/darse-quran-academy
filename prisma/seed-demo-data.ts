import { hash } from "bcryptjs";
import type { PrismaClient } from "@prisma/client";
import { getAdminEmails } from "../lib/admin";
import {
  DEMO_ADMIN_PASSWORD,
  DEMO_STUDENT_PASSWORD,
  demoStudents,
  type DemoEnrollment,
  type DemoPayment,
} from "../content/demo-students";
import { DEMO_TEACHER_PASSWORD, teachers } from "../content/teachers";
import { buildMonthlyFeeLabel } from "../lib/monthly-payments";
import {
  MONTHLY_PAYMENT_APPROVED,
  MONTHLY_PAYMENT_DECLINED,
  MONTHLY_PAYMENT_PENDING,
} from "../lib/monthly-payment-status";

function demoUserId(studentId: string) {
  return `seed-demo-user-${studentId}`;
}

function demoUserEmail(studentId: string) {
  return `demo-student-${studentId}@seed.local`;
}

function demoEnrollmentId(studentId: string, courseId: string) {
  return `seed-demo-enrollment-${studentId}-${courseId}`;
}

function demoPaymentId(studentId: string, courseId: string, month: string, year: string) {
  return `seed-demo-payment-${studentId}-${courseId}-${month}-${year}`;
}

function demoPaymentRecordId(studentId: string, courseId: string, month: string, year: string) {
  return `seed-demo-record-${studentId}-${courseId}-${month}-${year}`;
}

function paymentPaidAt(month: string, year: string) {
  const m = Number.parseInt(month, 10);
  const y = Number.parseInt(year, 10);
  return new Date(Date.UTC(y, m - 1, 15, 10, 0, 0));
}

async function seedDemoPayment(
  prisma: PrismaClient,
  studentId: string,
  userId: string,
  courseId: string,
  monthlyFeeInrPaise: number,
  payment: DemoPayment,
) {
  const submissionId = demoPaymentId(studentId, courseId, payment.month, payment.year);
  const label = buildMonthlyFeeLabel(payment.month, payment.year);
  const utr = `DEMO-UTR-${studentId}-${courseId}-${payment.month}${payment.year}`;

  if (payment.status === "approved") {
    const recordId = demoPaymentRecordId(studentId, courseId, payment.month, payment.year);
    const paidAt = paymentPaidAt(payment.month, payment.year);

    await prisma.paymentRecord.upsert({
      where: { id: recordId },
      create: {
        id: recordId,
        userId,
        courseId,
        amountInrPaise: monthlyFeeInrPaise,
        paidAt,
        description: label,
      },
      update: {
        amountInrPaise: monthlyFeeInrPaise,
        paidAt,
        description: label,
      },
    });

    await prisma.coursePaymentSubmission.upsert({
      where: { id: submissionId },
      create: {
        id: submissionId,
        userId,
        courseId,
        paymentType: "monthly",
        label,
        amountInrPaise: monthlyFeeInrPaise,
        status: MONTHLY_PAYMENT_APPROVED,
        paymentMethod: "upi",
        upiTransactionId: utr,
        paymentReference: `DEMO-REF-${submissionId}`,
        paymentRecordId: recordId,
      },
      update: {
        paymentType: "monthly",
        label,
        amountInrPaise: monthlyFeeInrPaise,
        status: MONTHLY_PAYMENT_APPROVED,
        paymentMethod: "upi",
        upiTransactionId: utr,
        paymentRecordId: recordId,
      },
    });
    return;
  }

  const status =
    payment.status === "pending" ? MONTHLY_PAYMENT_PENDING : MONTHLY_PAYMENT_DECLINED;

  await prisma.coursePaymentSubmission.upsert({
    where: { id: submissionId },
    create: {
      id: submissionId,
      userId,
      courseId,
      paymentType: "monthly",
      label,
      amountInrPaise: monthlyFeeInrPaise,
      status,
      paymentMethod: payment.status === "pending" ? "upi" : null,
      upiTransactionId: payment.status === "pending" ? utr : null,
      paymentReference: payment.status === "pending" ? `DEMO-REF-${submissionId}` : null,
      paymentScreenshotPath: null,
    },
    update: {
      paymentType: "monthly",
      label,
      amountInrPaise: monthlyFeeInrPaise,
      status,
      paymentMethod: payment.status === "pending" ? "upi" : null,
      upiTransactionId: payment.status === "pending" ? utr : null,
      paymentRecordId: null,
    },
  });
}

async function seedDemoEnrollment(
  prisma: PrismaClient,
  studentId: string,
  userId: string,
  enrollment: DemoEnrollment,
  courseFees: Map<string, number>,
) {
  const enrollmentId = demoEnrollmentId(studentId, enrollment.courseId);
  const monthlyFeeInrPaise = courseFees.get(enrollment.courseId) ?? 34900;
  const completedAt =
    enrollment.status === "completed" && enrollment.completedAt
      ? new Date(enrollment.completedAt)
      : enrollment.status === "completed"
        ? new Date("2026-03-01T12:00:00.000Z")
        : null;

  await prisma.enrollment.upsert({
    where: { id: enrollmentId },
    create: {
      id: enrollmentId,
      userId,
      courseId: enrollment.courseId,
      status: enrollment.status,
      completedAt,
    },
    update: {
      status: enrollment.status,
      completedAt,
    },
  });

  for (const payment of enrollment.payments ?? []) {
    await seedDemoPayment(
      prisma,
      studentId,
      userId,
      enrollment.courseId,
      monthlyFeeInrPaise,
      payment,
    );
  }
}

function demoTeacherUserId(teacherId: string) {
  return `seed-demo-teacher-user-${teacherId}`;
}

function demoAdminUserId(index: number) {
  return `seed-demo-admin-user-${index + 1}`;
}

function demoAdminDisplayName(email: string) {
  const local = email.split("@")[0] ?? "admin";
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/** Admin login accounts for every address in `ADMIN_EMAIL` (local / QA). */
export async function seedDemoAdmins(prisma: PrismaClient) {
  const emails = getAdminEmails();
  if (emails.length === 0) return;

  const hashedPassword = await hash(DEMO_ADMIN_PASSWORD, 12);

  for (const [index, email] of emails.entries()) {
    await prisma.user.upsert({
      where: { email },
      create: {
        id: demoAdminUserId(index),
        email,
        name: demoAdminDisplayName(email),
        password: hashedPassword,
      },
      update: {
        name: demoAdminDisplayName(email),
        password: hashedPassword,
      },
    });
  }
}

/** Demo teacher login accounts matching seeded teacher profiles (local / QA). */
export async function seedDemoTeachers(prisma: PrismaClient) {
  const hashedPassword = await hash(DEMO_TEACHER_PASSWORD, 12);

  for (const teacher of teachers) {
    const userId = demoTeacherUserId(teacher.id);

    await prisma.user.upsert({
      where: { email: teacher.email },
      create: {
        id: userId,
        email: teacher.email,
        name: teacher.name,
        password: hashedPassword,
      },
      update: {
        name: teacher.name,
        password: hashedPassword,
      },
    });
  }
}

/** Demo students with enrollments, monthly payments, and completed courses (local / QA). */
export async function seedDemoData(prisma: PrismaClient) {
  const courses = await prisma.course.findMany({
    select: { id: true, monthlyFeeInrPaise: true },
  });
  const courseFees = new Map(courses.map((c) => [c.id, c.monthlyFeeInrPaise]));

  const hashedPassword = await hash(DEMO_STUDENT_PASSWORD, 12);

  for (const student of demoStudents) {
    const userId = demoUserId(student.id);
    const email = demoUserEmail(student.id);

    await prisma.user.upsert({
      where: { id: userId },
      create: {
        id: userId,
        email,
        name: student.name,
        fatherName: student.fatherName,
        dateOfBirth: new Date(student.dateOfBirth),
        occupation: student.occupation,
        address: student.address,
        whatsapp: student.whatsapp,
        password: hashedPassword,
      },
      update: {
        email,
        name: student.name,
        fatherName: student.fatherName,
        dateOfBirth: new Date(student.dateOfBirth),
        occupation: student.occupation,
        address: student.address,
        whatsapp: student.whatsapp,
        password: hashedPassword,
      },
    });

    for (const enrollment of student.enrollments) {
      await seedDemoEnrollment(prisma, student.id, userId, enrollment, courseFees);
    }
  }
}

export function demoStudentLoginHint(): string {
  return `Demo students: demo-student-01@seed.local … demo-student-25@seed.local — password ${DEMO_STUDENT_PASSWORD}`;
}

export function demoTeacherLoginHint(): string {
  const first = teachers[0]?.email ?? "teacher@seed.local";
  const last = teachers[teachers.length - 1]?.email ?? first;
  return `Demo teachers: ${first} … ${last} — password ${DEMO_TEACHER_PASSWORD}`;
}

export function demoAdminLoginHint(): string {
  const emails = getAdminEmails();
  if (emails.length === 0) {
    return "Demo admins: none — set ADMIN_EMAIL in .env and re-run seed.";
  }
  return `Demo admins: ${emails.join(", ")} — password ${DEMO_ADMIN_PASSWORD}`;
}
