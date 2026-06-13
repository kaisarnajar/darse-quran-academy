import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PaymentConfirmForm } from "@/components/payment/PaymentConfirmForm";
import { PaymentDetailsPanel } from "@/components/payment/PaymentDetailsPanel";
import { Section } from "@/components/site/Section";
import { auth } from "@/lib/auth";
import {
  AWAITING_PAYMENT_VERIFICATION,
  needsPaymentSubmission,
  PAYMENT_DECLINED,
} from "@/lib/enrollment-status";
import { getCoursePricingFromCourse, getRegistrationFeePaise } from "@/lib/course-pricing";
import { formatPrice, getCourseById } from "@/lib/courses";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Complete payment",
  robots: { index: false, follow: false },
};

export default async function PaymentPage({ params }: { params: Promise<{ enrollmentId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/courses");
  }

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

  const registrationFeePaise = getRegistrationFeePaise(course);
  const amountLabel = formatPrice(registrationFeePaise);
  const paymentRef = enrollment.paymentReference ?? enrollment.id;

  return (
    <Section className="py-8 sm:py-12">
      <div className="mx-auto max-w-5xl">
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
            Your previous payment could not be verified. Please pay the enrollment fee again and
            submit a new transaction reference or screenshot for verification.
          </p>
        )}

        <div className="mt-8 space-y-8">
          <PaymentDetailsPanel
            paymentRef={paymentRef}
            amountLabel={amountLabel}
            amountPaise={registrationFeePaise}
            paymentNote={`${course.title}`.slice(0, 80)}
          />
          <p className="text-center text-xs text-muted">
            Monthly class fee (₹{getCoursePricingFromCourse(course).monthlyFeeInr}/month) is paid separately.
          </p>
          <PaymentConfirmForm enrollmentId={enrollment.id} />
        </div>
      </div>
    </Section>
  );
}
