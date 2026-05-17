import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CopyButton } from "@/components/payment/CopyButton";
import { PaymentConfirmForm } from "@/components/payment/PaymentConfirmForm";
import { Section } from "@/components/site/Section";
import { auth } from "@/lib/auth";
import { getCoursePricing, getRegistrationFeePaise } from "@/lib/course-pricing";
import { formatPrice, getCourseById } from "@/lib/courses";
import { prisma } from "@/lib/prisma";
import {
  buildUpiPaymentUrl,
  generateUpiQrDataUrl,
  getUpiId,
  getUpiPayeeName,
  isUpiConfigured,
} from "@/lib/upi";

export const metadata: Metadata = {
  title: "Pay with UPI",
  robots: { index: false, follow: false },
};

export default async function PaymentPage({ params }: { params: Promise<{ enrollmentId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/courses");
  }

  if (!isUpiConfigured()) {
    return (
      <Section>
        <p className="text-center text-muted">UPI payments are not configured. Please contact the academy.</p>
      </Section>
    );
  }

  const { enrollmentId } = await params;

  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
  });

  if (!enrollment || enrollment.userId !== session.user.id) {
    notFound();
  }

  if (enrollment.status === "active" || enrollment.status === "completed") {
    redirect("/my-courses");
  }

  if (enrollment.status === "pending_verification") {
    redirect("/my-courses?pending=1");
  }

  const course = await getCourseById(enrollment.courseId);
  if (!course) notFound();

  const registrationFeePaise = getRegistrationFeePaise(course.level);
  const paymentRef = enrollment.paymentReference ?? enrollment.id;
  const upiUrl = buildUpiPaymentUrl({
    amountPaise: registrationFeePaise,
    payeeName: getUpiPayeeName(),
    note: `${course.title}`.slice(0, 80),
    transactionRef: paymentRef,
  });
  const qrDataUrl = await generateUpiQrDataUrl(upiUrl);
  const upiId = getUpiId();

  return (
    <Section className="py-8 sm:py-12">
      <div className="mx-auto max-w-md">
        <Link href="/courses" className="text-sm text-primary hover:underline">
          ← Back to courses
        </Link>

        <h1 className="mt-4 font-serif text-2xl font-bold text-primary">Pay with UPI</h1>
        <p className="mt-1 text-sm text-muted">{course.title}</p>

        <div className="card-elevated mt-8 p-6 sm:p-8">
          <p className="text-center text-sm text-muted">Registration fee (one-time)</p>
          <p className="text-center text-3xl font-bold text-foreground">
            {formatPrice(registrationFeePaise)}
          </p>
          <p className="mt-2 text-center text-xs text-muted">
            Monthly class fee (₹{getCoursePricing(course.level).monthlyFeeInr}/month) is paid
            separately.
          </p>

          <div className="mx-auto mt-6 flex justify-center rounded-xl border border-border bg-white p-4">
            <Image
              src={qrDataUrl}
              alt="UPI QR code — scan with Google Pay, PhonePe, or Paytm"
              width={280}
              height={280}
              className="h-auto w-[220px] sm:w-[260px]"
              unoptimized
              priority
            />
          </div>

          <p className="mt-4 text-center text-sm font-medium text-foreground">
            Scan with Google Pay, PhonePe, Paytm, or any UPI app
          </p>

          <div className="mt-6 flex flex-col items-center gap-3 rounded-lg bg-background px-4 py-3 text-center">
            <div>
              <p className="text-xs text-muted">UPI ID</p>
              <p className="mt-0.5 font-mono text-sm font-semibold text-foreground">{upiId}</p>
            </div>
            <CopyButton text={upiId} label="Copy UPI ID" />
            <div className="w-full border-t border-border pt-3">
              <p className="text-xs text-muted">Payment reference (include if asked)</p>
              <p className="mt-0.5 font-mono text-xs text-foreground">{paymentRef}</p>
              <div className="mt-2">
                <CopyButton text={paymentRef} label="Copy reference" />
              </div>
            </div>
          </div>

          <PaymentConfirmForm enrollmentId={enrollment.id} />
        </div>
      </div>
    </Section>
  );
}
