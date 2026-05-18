import Image from "next/image";
import { BankDetailsCard } from "@/components/payment/BankDetailsCard";
import { CopyButton } from "@/components/payment/CopyButton";
import { getBankDetails } from "@/lib/bank";
import { COURSE_PRICING_SUMMARY } from "@/lib/course-pricing";
import {
  buildUpiPaymentUrl,
  buildUpiVpaUrl,
  generateUpiQrDataUrl,
  getUpiId,
  getUpiPayeeName,
  isUpiConfigured,
} from "@/lib/upi";

type PaymentDetailsPanelProps = {
  /** Enrollment payment: fixed amount and reference for QR and bank transfer. */
  paymentRef?: string;
  amountLabel?: string;
  amountPaise?: number;
  paymentNote?: string;
};

export async function PaymentDetailsPanel({
  paymentRef,
  amountLabel,
  amountPaise,
  paymentNote = "Darse Quran Academy registration",
}: PaymentDetailsPanelProps) {
  const upiReady = isUpiConfigured();
  const bank = getBankDetails();
  const upiId = upiReady ? getUpiId() : "";
  const isEnrollmentPayment = Boolean(paymentRef && amountPaise != null && amountLabel);

  const qrDataUrl =
    upiReady &&
    (await generateUpiQrDataUrl(
      isEnrollmentPayment
        ? buildUpiPaymentUrl({
            amountPaise: amountPaise!,
            payeeName: getUpiPayeeName(),
            note: paymentNote.slice(0, 80),
            transactionRef: paymentRef!,
          })
        : buildUpiVpaUrl(),
    ));

  return (
    <div className="card-elevated space-y-8 p-6 sm:p-8">
      {!isEnrollmentPayment && (
        <div className="text-center">
          <p className="text-sm text-muted">Registration fee (one-time, by course level)</p>
          <p className="mt-2 text-sm font-medium text-foreground">{COURSE_PRICING_SUMMARY}</p>
          <p className="mt-2 text-xs text-muted">
            Monthly class fees are paid separately by the academy after enrollment is confirmed.
          </p>
        </div>
      )}

      {isEnrollmentPayment && (
        <div className="text-center">
          <p className="text-sm text-muted">Amount to pay</p>
          <p className="text-3xl font-bold text-foreground">{amountLabel}</p>
        </div>
      )}

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
            />
          </div>
          <p className="mt-3 text-center text-sm font-medium text-foreground">
            Scan with Google Pay, PhonePe, Paytm, or any UPI app
          </p>
          {!isEnrollmentPayment && (
            <p className="mt-2 text-center text-xs text-muted">
              Enter the registration fee for your course level when your UPI app asks for the amount.
            </p>
          )}
          <div className="mt-4 flex flex-col items-center gap-3 rounded-lg bg-background px-4 py-3 text-center">
            <div>
              <p className="text-xs text-muted">UPI ID</p>
              <p className="mt-0.5 font-mono text-sm font-semibold text-foreground">{upiId}</p>
            </div>
            <CopyButton text={upiId} label="Copy UPI ID" />
            {isEnrollmentPayment && paymentRef && (
              <div className="w-full border-t border-border pt-3">
                <p className="text-xs text-muted">Payment reference (include if asked)</p>
                <p className="mt-0.5 font-mono text-xs text-foreground">{paymentRef}</p>
                <div className="mt-2">
                  <CopyButton text={paymentRef} label="Copy reference" />
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <section className={upiReady ? "border-t border-border pt-8" : ""}>
        <h2 className="text-center text-sm font-bold uppercase tracking-wide text-primary">
          {upiReady ? "Option 2 — Bank transfer" : "Bank transfer"}
        </h2>
        <div className="mt-4">
          <BankDetailsCard
            bank={bank}
            paymentRef={paymentRef}
            amountLabel={amountLabel}
            amountHint={!isEnrollmentPayment ? COURSE_PRICING_SUMMARY : undefined}
          />
        </div>
        {!isEnrollmentPayment && (
          <p className="mt-3 text-center text-xs text-muted">
            After you enroll in a course, you will get a unique payment reference on the payment confirmation
            page. Include that reference in your bank transfer remarks.
          </p>
        )}
      </section>
    </div>
  );
}
