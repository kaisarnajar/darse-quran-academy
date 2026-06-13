import { hash } from "bcryptjs";
import type { PrismaClient } from "@prisma/client";
import { getAdminEmails } from "../lib/admin";
import { courses } from "../content/courses";
import {
  DEMO_ADMIN_PASSWORD,
  DEMO_STUDENT_COUNT,
  DEMO_STUDENT_PASSWORD,
  demoStudents,
  type DemoEnrollment,
  type DemoPayment,
} from "../content/demo-students";
import { DEMO_TEACHER_PASSWORD, teachers } from "../content/teachers";
import {
  buildEnrollmentFeeLabel,
  buildMonthlyFeeLabel,
} from "../lib/monthly-payments";
import {
  MONTHLY_PAYMENT_APPROVED,
  MONTHLY_PAYMENT_DECLINED,
  MONTHLY_PAYMENT_PENDING,
  PAYMENT_TYPE_ENROLLMENT,
  PAYMENT_TYPE_MONTHLY,
} from "../lib/monthly-payment-status";

type CourseSeedMeta = {
  monthlyFeeInrPaise: number;
  enrollmentFeeInrPaise: number;
  title: string;
};

function demoUserId(studentId: string) {
  return `seed-demo-user-${studentId}`;
}

function demoUserEmail(studentId: string) {
  return `demo-student-${studentId}@seed.local`;
}

function demoEnrollmentId(studentId: string, courseId: string) {
  return `seed-demo-enrollment-${studentId}-${courseId}`;
}

function demoPaymentId(
  studentId: string,
  courseId: string,
  payment: DemoPayment,
) {
  if (payment.paymentType === PAYMENT_TYPE_ENROLLMENT) {
    return `seed-demo-payment-${studentId}-${courseId}-enrollment`;
  }
  return `seed-demo-payment-${studentId}-${courseId}-${payment.month}-${payment.year}`;
}

function demoPaymentRecordId(
  studentId: string,
  courseId: string,
  payment: DemoPayment,
) {
  if (payment.paymentType === PAYMENT_TYPE_ENROLLMENT) {
    return `seed-demo-record-${studentId}-${courseId}-enrollment`;
  }
  return `seed-demo-record-${studentId}-${courseId}-${payment.month}-${payment.year}`;
}

function paymentPaidAt(payment: DemoPayment) {
  if (payment.paymentType === PAYMENT_TYPE_ENROLLMENT) {
    return new Date("2026-01-10T10:00:00.000Z");
  }
  const m = Number.parseInt(payment.month ?? "1", 10);
  const y = Number.parseInt(payment.year ?? "2026", 10);
  return new Date(Date.UTC(y, m - 1, 15, 10, 0, 0));
}

async function seedDemoPayment(
  prisma: PrismaClient,
  studentId: string,
  userId: string,
  courseId: string,
  courseMeta: CourseSeedMeta,
  payment: DemoPayment,
) {
  const paymentType = payment.paymentType ?? PAYMENT_TYPE_MONTHLY;
  const submissionId = demoPaymentId(studentId, courseId, payment);
  const amountInrPaise =
    paymentType === PAYMENT_TYPE_ENROLLMENT
      ? courseMeta.enrollmentFeeInrPaise
      : courseMeta.monthlyFeeInrPaise;
  const label =
    paymentType === PAYMENT_TYPE_ENROLLMENT
      ? buildEnrollmentFeeLabel(courseMeta.title)
      : buildMonthlyFeeLabel(payment.month ?? "01", payment.year ?? "2026");
  const utr = `DEMO-UTR-${studentId}-${courseId}-${paymentType}-${submissionId.slice(-8)}`;

  if (payment.status === "approved") {
    const recordId = demoPaymentRecordId(studentId, courseId, payment);
    const paidAt = paymentPaidAt(payment);

    await prisma.paymentRecord.upsert({
      where: { id: recordId },
      create: {
        id: recordId,
        userId,
        courseId,
        amountInrPaise,
        paidAt,
        description: label,
      },
      update: {
        amountInrPaise,
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
        paymentType,
        label,
        amountInrPaise,
        status: MONTHLY_PAYMENT_APPROVED,
        paymentMethod: "upi",
        upiTransactionId: utr,
        paymentReference: `DEMO-REF-${submissionId}`,
        paymentRecordId: recordId,
      },
      update: {
        paymentType,
        label,
        amountInrPaise,
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
      paymentType,
      label,
      amountInrPaise,
      status,
      paymentMethod: payment.status === "pending" ? "upi" : null,
      upiTransactionId: payment.status === "pending" ? utr : null,
      paymentReference: payment.status === "pending" ? `DEMO-REF-${submissionId}` : null,
      paymentScreenshotPath: null,
    },
    update: {
      paymentType,
      label,
      amountInrPaise,
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
  courseMetaById: Map<string, CourseSeedMeta>,
) {
  const courseMeta = courseMetaById.get(enrollment.courseId);
  if (!courseMeta) return;

  const enrollmentId = demoEnrollmentId(studentId, enrollment.courseId);
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
    await seedDemoPayment(prisma, studentId, userId, enrollment.courseId, courseMeta, payment);
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

/** Demo students with enrollments, enrollment fees, and monthly payments (local / QA). */
export async function seedDemoData(prisma: PrismaClient) {
  const courses = await prisma.course.findMany({
    select: {
      id: true,
      title: true,
      monthlyFeeInrPaise: true,
      priceInrPaise: true,
    },
  });
  const courseMetaById = new Map<string, CourseSeedMeta>(
    courses.map((course) => [
      course.id,
      {
        monthlyFeeInrPaise: course.monthlyFeeInrPaise,
        enrollmentFeeInrPaise: course.priceInrPaise,
        title: course.title,
      },
    ]),
  );

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
      await seedDemoEnrollment(prisma, student.id, userId, enrollment, courseMetaById);
    }
  }
}

export function demoStudentLoginHint(): string {
  const last = String(DEMO_STUDENT_COUNT).padStart(2, "0");
  return `Demo students: demo-student-01@seed.local … demo-student-${last}@seed.local — password ${DEMO_STUDENT_PASSWORD}`;
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

export function demoDataSummaryHint(): string {
  return [
    `Demo dataset: ${courses.length} courses, ${teachers.length} teachers, ${DEMO_STUDENT_COUNT} students`,
    "  Enrollments — pending approval (free), awaiting fee, active, completed",
    "  Payments — enrollment fee + monthly fee (approved, pending, declined)",
  ].join("\n");
}
