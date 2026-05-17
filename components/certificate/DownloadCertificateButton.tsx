"use client";

import { useState } from "react";

export function DownloadCertificateButton({
  enrollmentId,
  courseTitle,
}: {
  enrollmentId: string;
  courseTitle: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      const res = await fetch(`/api/certificate/${enrollmentId}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        window.alert(data.error || "Could not download certificate.");
        setLoading(false);
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download =
        res.headers.get("Content-Disposition")?.match(/filename="(.+)"/)?.[1] ??
        `certificate-${courseTitle.replace(/\s+/g, "-").toLowerCase()}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch {
      window.alert("Could not download certificate. Please try again.");
    }
    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={loading}
      className="mt-4 flex min-h-11 w-full items-center justify-center rounded-full bg-accent px-4 py-3 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:opacity-60"
    >
      {loading ? "Preparing…" : "Download certificate"}
    </button>
  );
}
