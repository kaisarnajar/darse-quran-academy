import { prisma } from "@/utils/prisma";
import { StandardizedPaymentEvent } from "@/types/payment-gateway";
import { getRosterEnrollmentStatusForCourse } from "@/services/enrollments";
import { getCourseById } from "@/services/courses";
import { notifyPaymentApproved } from "@/services/notifications";
import { assignRollNumber } from "@/services/roll-numbers";
import { revalidatePath } from "next/cache";

function revalidatePaymentPaths(userId: string, courseId?: string | null) {
  const paths = [
    "/admin",
    "/admin/finance",
    "/admin/enrollments",
    "/admin/payments",
    "/admin/students",
    `/admin/students/${userId}`,
    "/profile/payments",
    "/profile/courses",
    "/profile/notifications",
  ];
  if (courseId) {
    paths.push(`/admin/courses/${courseId}/students`);
  }
  for (const path of paths) {
    revalidatePath(path, "layout");
    revalidatePath(path, "page");
  }
}

export async function handlePaymentSuccess(event: StandardizedPaymentEvent) {
  const existingRecord = await prisma.paymentRecord.findFirst({
    where: {
      description: {
        contains: event.gatewaySessionId,
      },
    },
  });
  if (existingRecord) {
    console.log(`[Payments] Payment for session ${event.gatewaySessionId} already processed.`);
    return;
  }

  const submission = await prisma.coursePaymentSubmission.findFirst({
    where: {
      upiTransactionId: event.gatewaySessionId,
      status: "pending_verification",
    },
  });

  const course = await getCourseById(event.courseId || "");

  await prisma.$transaction(async (tx) => {
    // 1. Create audit record
    const record = await tx.paymentRecord.create({
      data: {
        userId: event.userId,
        courseId: event.courseId || null,
        amountInrPaise: event.amountInrPaise,
        paidAt: new Date(),
        paymentType: event.paymentType,
        description: submission?.label || `Gateway payment - ${event.paymentType} (${event.gatewaySessionId})`,
      },
    });

    // 2. Update Submission
    if (submission) {
      await tx.coursePaymentSubmission.update({
        where: { id: submission.id },
        data: {
          status: "approved",
          paymentRecordId: record.id,
        },
      });
    }

    // 3. Update Enrollment status (if enrollment payment)
    if (event.paymentType === "enrollment" && course) {
      await tx.enrollment.updateMany({
        where: {
          userId: event.userId,
          courseId: course.id,
          status: { in: ["awaiting_enrollment_fee", "pending_approval"] },
        },
        data: {
          status: getRosterEnrollmentStatusForCourse(course.status),
        },
      });
    }
  });

  // 4. Assign Roll Number
  if (event.paymentType === "enrollment" && course && getRosterEnrollmentStatusForCourse(course.status) === "active") {
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: event.userId, courseId: course.id } },
      select: { id: true },
    });
    if (enrollment) {
      await assignRollNumber(enrollment.id, course.id);
    }
  }

  // 5. Send Notification
  if (course) {
    await notifyPaymentApproved({
      userId: event.userId,
      courseTitle: course.title,
      sourceId: submission?.id || event.gatewaySessionId,
      sourceType: "CoursePaymentSubmission",
    });
  }

  revalidatePaymentPaths(event.userId, event.courseId);
  console.log(`[Payments] Successfully reconciled payment for user ${event.userId}, session ${event.gatewaySessionId}`);
}
