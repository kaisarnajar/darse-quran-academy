import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { BankDetailsCard } from "@/components/payment/BankDetailsCard";
import { CopyButton } from "@/components/payment/CopyButton";
import { PaymentConfirmForm } from "@/components/payment/PaymentConfirmForm";
import { Section } from "@/components/site/Section";
import { auth } from "@/lib/auth";
import {
  AWAITING_PAYMENT_VERIFICATION,
  needsPaymentSubmission,
  PAYMENT_DECLINED,
} from "@/lib/enrollment-status";
import { getBankDetails } from "@/lib/bank";
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
  title: "Complete payment",
  robots: { index: false, follow: false },
};

export default async function PaymentPage({ params }: { params: Promise<{ enrollmentId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/courses");
  }

  const upiReady = isUpiConfigured();
  const bank = getBankDetails();
  const { enrollmentId } = await params;

  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
  });

  if (!enrollment || enrollment.userId !== session.user.id) {
    notFound();
  }

  if (enrollment.status === "active" || enrollment.status === "completed") {
    redirect("/profile/courses");
  }

  if (enrollment.status === AWAITING_PAYMENT_VERIFICATION) {
    redirect("/profile/courses?pending=1");
  }

  if (!needsPaymentSubmission(enrollment.status)) {
    redirect("/profile/courses");
  }

  const course = await getCourseById(enrollment.courseId);
  if (!course) notFound();

  const registrationFeePaise = getRegistrationFeePaise(course.level);
  const amountLabel = formatPrice(registrationFeePaise);
  const paymentRef = enrollment.paymentReference ?? enrollment.id;
  const upiId = upiReady ? getUpiId() : "";
  const qrDataUrl = upiReady
    ? await generateUpiQrDataUrl(
        buildUpiPaymentUrl({
          amountPaise: registrationFeePaise,
          payeeName: getUpiPayeeName(),
          note: `${course.title}`.slice(0, 80),
          transactionRef: paymentRef,
        }),
      )
    : null;

  return (
    <Section className="py-8 sm:py-12">
      <div className="mx-auto max-w-lg">
        <Link href="/courses" className="text-sm text-primary hover:underline">
          ← Back to courses
        </Link>

        <h1 className="mt-4 font-serif text-2xl font-bold text-primary">Complete payment</h1>
        <p className="mt-1 text-sm text-muted">{course.title}</p>

        {enrollment.status === PAYMENT_DECLINED && (
          <p
            className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
            role="alert"
          >
            Your previous payment could not be verified. Please pay the registration fee again and
            submit a new transaction reference or screenshot for verification.
          </p>
        )}

        <div className="card-elevated mt-8 space-y-8 p-6 sm:p-8">
          <div className="text-center">
            <p className="text-sm text-muted">Registration fee (one-time)</p>
            <p className="text-3xl font-bold text-foreground">{amountLabel}</p>
            <p className="mt-2 text-xs text-muted">
              Monthly class fee (₹{getCoursePricing(course.level).monthlyFeeInr}/month) is paid separately.
            </p>
          </div>

          {upiReady && qrDataUrl && (
            <section>
              <h2 className="text-center text-sm font-bold uppercase tracking-wide text-primary">
                Option 1 — UPI
              </h2>
              <div className="mx-auto mt-4 flex justify-center rounded-xl border border-border bg-white p-4">
                <Image
                  src={qrDataUrl}
                  alt="UPI QR code — scan with Google Pay, PhonePe, or Paytm"
                  width={280}
                  height={280}
                  className="h-auto w-[200px] sm:w-[240px]"
                  unoptimized
                  priority
                />
              </div>
              <p className="mt-3 text-center text-sm font-medium text-foreground">
                Scan with Google Pay, PhonePe, Paytm, or any UPI app
              </p>
              <div className="mt-4 flex flex-col items-center gap-3 rounded-lg bg-background px-4 py-3 text-center">
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
            </section>
          )}

          <section className={upiReady ? "border-t border-border pt-8" : ""}>
            <h2 className="text-center text-sm font-bold uppercase tracking-wide text-primary">
              {upiReady ? "Option 2 — Bank transfer" : "Bank transfer"}
            </h2>
            <div className="mt-4">
              <BankDetailsCard bank={bank} paymentRef={paymentRef} amountLabel={amountLabel} />
            </div>
          </section>

          <PaymentConfirmForm enrollmentId={enrollment.id} />
        </div>
      </div>
    </Section>
  );
}
