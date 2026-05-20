"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import {
  sendGeneratedCertificate,
  uploadAndSendCertificate,
} from "@/app/admin/enrollments/actions";

type SendCertificateButtonProps = {
  enrollmentId: string;
  courseId: string;
  certificateEmailSentAt: Date | null;
};

export function SendCertificateButton({
  enrollmentId,
  courseId,
  certificateEmailSentAt,
}: SendCertificateButtonProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<"generate" | "upload" | null>(null);

  async function handleGenerate() {
    const resendNote = certificateEmailSentAt
      ? " A certificate email was already sent; this will send again with the generated certificate."
      : "";

    if (
      !window.confirm(
        `Generate the certificate and email the download link to the student?${resendNote}`,
      )
    ) {
      return;
    }

    setLoading("generate");
    const result = await sendGeneratedCertificate(enrollmentId, courseId);
    setLoading(null);
    setOpen(false);

    if (result.error) {
      window.alert(result.error);
      return;
    }

    router.refresh();
  }

  async function handleUpload(file: File) {
    const resendNote = certificateEmailSentAt
      ? " A certificate email was already sent; this will send again with the uploaded file."
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
    formData.set("certificate", file);
    const result = await uploadAndSendCertificate(enrollmentId, courseId, formData);
    setLoading(null);
    setOpen(false);

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
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        disabled={loading !== null}
        className="rounded-md border border-accent-warm bg-accent-warm/10 px-3 py-1.5 text-xs font-semibold text-accent-warm hover:bg-accent-warm/20 disabled:opacity-60"
      >
        {loading ? "Sending…" : "Send certificate"}
      </button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-10 cursor-default"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 z-20 mt-1 w-56 rounded-lg border border-border bg-surface py-1 shadow-lg">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading !== null}
              className="block w-full px-4 py-2 text-left text-sm text-foreground hover:bg-background/80 disabled:opacity-60"
            >
              Generate certificate
            </button>
            <label className="block w-full cursor-pointer px-4 py-2 text-sm text-foreground hover:bg-background/80">
              Upload certificate
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
        </>
      )}
    </div>
  );
}
