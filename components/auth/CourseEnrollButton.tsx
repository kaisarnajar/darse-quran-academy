"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { formatPrice } from "@/lib/courses";

type CourseEnrollButtonProps = {
  courseId: string;
  priceInrPaise: number;
  isEnrolled: boolean;
};

export function CourseEnrollButton({ courseId, priceInrPaise, isEnrolled }: CourseEnrollButtonProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (isEnrolled) {
    return (
      <Link
        href="/my-courses"
        className="mt-4 flex min-h-11 w-full items-center justify-center rounded-md border border-primary bg-primary/5 px-4 py-3 text-sm font-medium text-primary"
      >
        Enrolled — View My Courses
      </Link>
    );
  }

  async function handleEnroll() {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });

      const data = await res.json();

      if (res.status === 401) {
        window.location.href = `/login?callbackUrl=${encodeURIComponent(`/courses`)}`;
        return;
      }

      if (!res.ok) {
        setError(data.error || "Could not start checkout.");
        setLoading(false);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      setError("Checkout URL not received.");
      setLoading(false);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  if (!session?.user) {
    return (
      <Link
        href={`/login?callbackUrl=${encodeURIComponent("/courses")}`}
        className="mt-4 flex min-h-11 w-full flex-col items-center justify-center rounded-md bg-primary px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-light sm:flex-row sm:gap-2"
      >
        <span>Sign in to Enroll</span>
        <span className="text-white/90">· {formatPrice(priceInrPaise)}</span>
      </Link>
    );
  }

  return (
    <div className="mt-4">
      {error && (
        <p className="mb-2 text-center text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
      <button
        type="button"
        onClick={handleEnroll}
        disabled={loading}
        className="flex min-h-11 w-full flex-col items-center justify-center rounded-md bg-primary px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-light active:bg-primary-light disabled:opacity-60 sm:flex-row sm:gap-2"
      >
        <span>{loading ? "Redirecting…" : "Enroll Now"}</span>
        <span className="text-white/90">· {formatPrice(priceInrPaise)}</span>
      </button>
    </div>
  );
}
