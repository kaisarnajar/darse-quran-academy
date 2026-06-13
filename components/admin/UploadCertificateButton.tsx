"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { uploadCertificate } from "@/app/admin/enrollments/actions";

const actionButtonClass =
  "inline-flex min-h-9 items-center justify-center rounded-md border border-primary bg-surface px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-accent-muted/50 disabled:opacity-60";

export function UploadCertificateButton({
  enrollmentId,
  courseId,
  hasCertificate,
}: {
  enrollmentId: string;
  courseId: string;
  hasCertificate: boolean;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  async function handleUpload(file: File) {
    const replaceNote = hasCertificate ? " This will replace the existing certificate." : "";

    if (!window.confirm(`Upload this PDF certificate for the student?${replaceNote}`)) {
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.set("certificate", file);
    const result = await uploadCertificate(enrollmentId, courseId, formData);
    setLoading(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (result.error) {
      window.alert(result.error);
      return;
    }

    router.refresh();
  }

  return (
    <label className={`${actionButtonClass} cursor-pointer ${loading ? "pointer-events-none opacity-60" : ""}`}>
      {loading ? "Uploading…" : hasCertificate ? "Reupload certificate" : "Upload Certificate"}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        className="sr-only"
        disabled={loading}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void handleUpload(file);
        }}
      />
    </label>
  );
}
