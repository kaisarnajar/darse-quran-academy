import Image from "next/image";
import { BankDetailsCard } from "@/components/payment/BankDetailsCard";
import { CopyButton } from "@/components/payment/CopyButton";
import { getBankDetails } from "@/lib/bank";
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
    <div className="card-elevated space-y-6 p-6 sm:p-8">
      {isEnrollmentPayment && (
        <div className="text-center">
          <p className="text-sm text-muted">Amount to pay</p>
          <p className="text-3xl font-bold text-foreground">{amountLabel}</p>
        </div>
      )}

      <div
        className={
          upiReady ? "grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-10" : "mx-auto max-w-xl"
        }
      >
        {upiReady && qrDataUrl && (
          <section className="flex h-full flex-col">
            <h2 className="text-center text-sm font-bold uppercase tracking-wide text-primary lg:text-left">
              UPI
            </h2>
            <div className="mx-auto mt-4 flex flex-1 flex-col lg:mx-0">
              <div className="flex justify-center rounded-xl border border-border bg-white p-4 lg:justify-start">
                <Image
                  src={qrDataUrl}
                  alt="UPI QR code — scan with Google Pay, PhonePe, or Paytm"
                  width={280}
                  height={280}
                  className="h-auto w-[200px] sm:w-[220px]"
                  unoptimized
                />
              </div>
              <p className="mt-3 text-center text-sm font-medium text-foreground lg:text-left">
                Scan with Google Pay, PhonePe, Paytm, or any UPI app
              </p>
              <div className="mt-4 flex flex-col items-center gap-3 rounded-lg bg-background px-4 py-3 text-center lg:items-start lg:text-left">
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
            </div>
          </section>
        )}

        <section
          className={`flex h-full flex-col ${upiReady ? "lg:border-l lg:border-border lg:pl-10" : ""}`}
        >
          <h2 className="text-center text-sm font-bold uppercase tracking-wide text-primary lg:text-left">
            Bank transfer
          </h2>
          <div className="mt-4 flex-1">
            <BankDetailsCard bank={bank} paymentRef={paymentRef} amountLabel={amountLabel} />
          </div>
          {!isEnrollmentPayment && (
            <p className="mt-3 text-center text-xs text-muted lg:text-left">
              After you enroll in a course, you will get a unique payment reference on the payment
              confirmation page. Include that reference in your bank transfer remarks.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
