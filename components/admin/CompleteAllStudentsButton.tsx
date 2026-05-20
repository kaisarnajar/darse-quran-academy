"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { completeAllActiveStudents } from "@/app/admin/enrollments/actions";

export function CompleteAllStudentsButton({
  courseId,
  activeCount,
}: {
  courseId: string;
  activeCount: number;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (activeCount === 0) return null;

  async function handleCompleteAll() {
    if (
      !window.confirm(
        `Mark all ${activeCount} active student(s) as complete?`,
      )
    ) {
      return;
    }

    setLoading(true);
    const result = await completeAllActiveStudents(courseId);
    setLoading(false);

    if (result.error) {
      window.alert(result.error);
      return;
    }

    if (result.success && (result.completed ?? 0) > 0) {
      window.location.href = `/admin/courses/${courseId}/students?completed=1`;
      return;
    }

    window.alert(result.error ?? "No students were completed.");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleCompleteAll}
      disabled={loading}
      className="inline-flex min-h-11 items-center justify-center rounded-md bg-accent-warm px-5 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
    >
      {loading ? "Completing…" : `Complete all active (${activeCount})`}
    </button>
  );
}
