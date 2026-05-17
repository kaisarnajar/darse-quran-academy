import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getCourseById } from "@/lib/courses";
import { prisma } from "@/lib/prisma";
import { isStripeConfigured, stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Please sign in to enroll." }, { status: 401 });
  }

  if (!isStripeConfigured() || !stripe) {
    return NextResponse.json(
      { error: "Payments are not configured yet. Please contact the academy." },
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

    const baseUrl = process.env.AUTH_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: session.user.email ?? undefined,
      line_items: [
        {
          price_data: {
            currency: "inr",
            unit_amount: course.priceInrPaise,
            product_data: {
              name: course.title,
              description: course.description.slice(0, 500),
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: session.user.id,
        courseId: course.id,
      },
      success_url: `${baseUrl}/my-courses?success=1`,
      cancel_url: `${baseUrl}/courses?canceled=1`,
    });

    if (existing) {
      await prisma.enrollment.update({
        where: { id: existing.id },
        data: { stripeSessionId: checkoutSession.id, status: "pending" },
      });
    } else {
      await prisma.enrollment.create({
        data: {
          userId: session.user.id,
          courseId: course.id,
          status: "pending",
          stripeSessionId: checkoutSession.id,
        },
      });
    }

    return NextResponse.json({ url: checkoutSession.url });
  } catch {
    return NextResponse.json({ error: "Could not start checkout. Please try again." }, { status: 500 });
  }
}
