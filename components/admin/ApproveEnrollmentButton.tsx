"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { approveEnrollmentRequest } from "@/app/admin/enrollments/actions";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export function ApproveEnrollmentButton({
  enrollmentId,
  courseId,
}: {
  enrollmentId: string;
  courseId: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [hidden, setHidden] = useState(false);
  const [pending, startTransition] = useTransition();

  if (hidden) return null;

  function getReturnTo() {
    const query = searchParams.toString();
    return query ? `${pathname}?${query}` : pathname;
  }

  function handleApprove() {
    if (!window.confirm("Approve this enrollment and grant the student access to the course?")) return;

    startTransition(async () => {
      try {
        const result = await approveEnrollmentRequest(enrollmentId, courseId, getReturnTo());
        if (result?.error) {
          window.alert(result.error);
          return;
        }
        setHidden(true);
      } catch (error) {
        if (isRedirectError(error)) {
          setHidden(true);
          return;
        }
        window.alert("Could not approve enrollment. Please try again.");
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleApprove}
      disabled={pending}
      className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-light disabled:opacity-60"
    >
      {pending ? "…" : "Approve enrollment"}
    </button>
  );
}
