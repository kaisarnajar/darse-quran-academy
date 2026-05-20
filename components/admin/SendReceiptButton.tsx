"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import {
  sendGeneratedReceipt,
  uploadAndSendReceipt,
} from "@/app/admin/payment-approvals/actions";

type SendReceiptButtonProps = {
  paymentRecordId: string;
  receiptEmailSentAt: Date | null;
};

const actionButtonClass =
  "inline-flex min-h-9 items-center justify-center rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-60";

export function SendReceiptButton({
  paymentRecordId,
  receiptEmailSentAt,
}: SendReceiptButtonProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<"generate" | "upload" | null>(null);

  async function handleGenerate() {
    const resendNote = receiptEmailSentAt
      ? " A receipt email was already sent; this will send again with the generated receipt."
      : "";

    if (
      !window.confirm(
        `Generate the receipt and email the download link to the student?${resendNote}`,
      )
    ) {
      return;
    }

    setLoading("generate");
    const result = await sendGeneratedReceipt(paymentRecordId);
    setLoading(null);

    if (result.error) {
      window.alert(result.error);
      return;
    }

    router.refresh();
  }

  async function handleUpload(file: File) {
    const resendNote = receiptEmailSentAt
      ? " A receipt email was already sent; this will send again with the uploaded file."
      : "";

    if (
      !window.confirm(
        `Upload this PDF and email the download link to the student?${resendNote}`,
      )
    ) {
      return;
    }

    setLoading("upload");
    const formData = new FormData();
    formData.set("receipt", file);
    const result = await uploadAndSendReceipt(paymentRecordId, formData);
    setLoading(null);

    if (result.error) {
      window.alert(result.error);
      return;
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    router.refresh();
  }

  return (
    <div className="flex min-w-[11rem] flex-col items-stretch gap-1.5">
      <button
        type="button"
        onClick={handleGenerate}
        disabled={loading !== null}
        className={`${actionButtonClass} border-primary bg-primary text-white hover:bg-primary-light`}
      >
        {loading === "generate" ? "Sending…" : "Generate receipt"}
      </button>
      <label
        className={`${actionButtonClass} cursor-pointer border-border bg-surface text-foreground hover:bg-background/80 ${
          loading === "upload" ? "pointer-events-none opacity-60" : ""
        }`}
      >
        {loading === "upload" ? "Uploading…" : "Upload receipt"}
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="sr-only"
          disabled={loading !== null}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void handleUpload(file);
          }}
        />
      </label>
    </div>
  );
}
