import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getCourseById } from "@/lib/courses";
import { prisma } from "@/lib/prisma";
import { isUpiConfigured } from "@/lib/upi";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Please sign in to enroll." }, { status: 401 });
  }

  if (!isUpiConfigured()) {
    return NextResponse.json(
      { error: "UPI payments are not configured yet. Please contact the academy." },
      { status: 503 },
    );
  }

  try {
    const { courseId } = await request.json();

    if (typeof courseId !== "string") {
      return NextResponse.json({ error: "Invalid course." }, { status: 400 });
    }

    const course = await getCourseById(courseId);
    if (!course || !course.published) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    const existing = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId: session.user.id, courseId },
      },
    });

    if (existing?.status === "active") {
      return NextResponse.json({ error: "You are already enrolled in this course." }, { status: 400 });
    }

    if (existing?.status === "pending_verification") {
      return NextResponse.json({
        paymentUrl: `/payment/${existing.id}`,
        message: "Payment is awaiting verification.",
      });
    }

    let enrollmentId: string;

    if (existing) {
      const updated = await prisma.enrollment.update({
        where: { id: existing.id },
        data: {
          status: "pending",
          paymentMethod: "upi",
          paymentReference: existing.paymentReference ?? existing.id,
        },
      });
      enrollmentId = updated.id;
    } else {
      const created = await prisma.enrollment.create({
        data: {
          userId: session.user.id,
          courseId: course.id,
          status: "pending",
          paymentMethod: "upi",
        },
      });
      await prisma.enrollment.update({
        where: { id: created.id },
        data: { paymentReference: created.id },
      });
      enrollmentId = created.id;
    }

    return NextResponse.json({ paymentUrl: `/payment/${enrollmentId}` });
  } catch {
    return NextResponse.json({ error: "Could not start payment. Please try again." }, { status: 500 });
  }
}
