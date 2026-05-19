import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isCourseEnrollmentOpen } from "@/lib/course-status";
import { getCourseById } from "@/lib/courses";
import { PENDING_ENROLLMENT_APPROVAL } from "@/lib/enrollment-status";
import { isUserProfileComplete, PROFILE_COMPLETE_REDIRECT } from "@/lib/profile";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Please sign in to enroll." }, { status: 401 });
  }

  try {
    const { courseId } = await request.json();

    if (typeof courseId !== "string") {
      return NextResponse.json({ error: "Invalid course." }, { status: 400 });
    }

    const course = await getCourseById(courseId);
    if (!course || !isCourseEnrollmentOpen(course.status)) {
      return NextResponse.json(
        { error: "This course is not open for enrollment." },
        { status: 404 },
      );
    }

    const existing = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId: session.user.id, courseId },
      },
    });

    if (existing?.status === "active" || existing?.status === "completed") {
      return NextResponse.json(
        {
          error: "You are already enrolled in this course.",
          alreadyEnrolled: true,
        },
        { status: 400 },
      );
    }

    if (existing?.status === PENDING_ENROLLMENT_APPROVAL) {
      return NextResponse.json({
        redirectUrl: "/profile/courses?requested=1",
        message: "Your enrollment request is already awaiting approval by the academy.",
        alreadyEnrolled: true,
      });
    }

    if (existing) {
      return NextResponse.json({
        redirectUrl: "/profile/courses",
        message: "You already have an enrollment request for this course.",
        alreadyEnrolled: true,
      });
    }

    const profileComplete = await isUserProfileComplete(session.user.id);
    if (!profileComplete) {
      return NextResponse.json(
        {
          error: "Please complete your profile before enrolling in a course.",
          profileIncomplete: true,
          redirectUrl: PROFILE_COMPLETE_REDIRECT,
        },
        { status: 403 },
      );
    }

    await prisma.enrollment.create({
      data: {
        userId: session.user.id,
        courseId: course.id,
        status: PENDING_ENROLLMENT_APPROVAL,
      },
    });

    return NextResponse.json({
      redirectUrl: "/profile/courses?requested=1",
      message: "Enrollment request submitted. The academy will approve your access shortly.",
    });
  } catch {
    return NextResponse.json({ error: "Could not submit enrollment request. Please try again." }, { status: 500 });
  }
}
