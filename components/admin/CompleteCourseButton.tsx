"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { completeEnrollment } from "@/app/admin/enrollments/actions";

export function CompleteCourseButton({
  enrollmentId,
  courseId,
}: {
  enrollmentId: string;
  courseId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleComplete() {
    if (!window.confirm("Mark this student as course complete?")) {
      return;
    }

    setLoading(true);
    const result = await completeEnrollment(enrollmentId, courseId);
    setLoading(false);

    if (result.error) {
      window.alert(result.error);
      return;
    }

    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleComplete}
      disabled={loading}
      className="rounded-md border border-primary bg-surface px-3 py-1.5 text-xs font-semibold text-primary hover:bg-accent-muted/50 disabled:opacity-60"
    >
      {loading ? "…" : "Complete"}
    </button>
  );
}
