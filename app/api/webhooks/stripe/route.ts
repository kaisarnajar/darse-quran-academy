import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing webhook configuration" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const courseId = session.metadata?.courseId;

    if (userId && courseId) {
      await prisma.enrollment.upsert({
        where: {
          userId_courseId: { userId, courseId },
        },
        create: {
          userId,
          courseId,
          status: "active",
          stripeSessionId: session.id,
          amountPaid: session.amount_total ?? undefined,
          currency: session.currency ?? "inr",
        },
        update: {
          status: "active",
          stripeSessionId: session.id,
          amountPaid: session.amount_total ?? undefined,
          currency: session.currency ?? "inr",
        },
      });
    }
  }

  return NextResponse.json({ received: true });
}
