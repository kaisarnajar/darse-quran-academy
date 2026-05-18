"use client";

import type { CourseStatus } from "@prisma/client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { formatPrice } from "@/lib/courses";
import { getRegistrationFeePaise } from "@/lib/course-pricing";
import { getCourseEnrollmentClosedMessage } from "@/lib/course-status";
import { getCourseEnrollmentReminder, hasCourseEnrollment } from "@/lib/enrollments";
import { PROFILE_COMPLETE_REDIRECT } from "@/lib/profile";

type CourseEnrollButtonProps = {
  courseId: string;
  level: string;
  courseStatus: CourseStatus;
  isEnrolled?: boolean;
  enrollmentStatus?: string | null;
  enrollmentId?: string | null;
  profileComplete?: boolean;
};

function EnrollmentReminder({ message }: { message: string }) {
  return (
    <p
      className="mb-3 rounded-lg border border-violet-200 bg-violet-50 px-3 py-2.5 text-center text-sm text-violet-900"
      role="status"
    >
      {message}
    </p>
  );
}

export function CourseEnrollButton({
  courseId,
  level,
  courseStatus,
  isEnrolled = false,
  enrollmentStatus = null,
  enrollmentId = null,
  profileComplete = true,
}: CourseEnrollButtonProps) {
  const registrationFeePaise = getRegistrationFeePaise(level);
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const reminder = getCourseEnrollmentReminder(enrollmentStatus);
  const showReminder = hasCourseEnrollment(enrollmentStatus) && Boolean(reminder);
  const enrollmentClosedMessage = getCourseEnrollmentClosedMessage(courseStatus);

  if (enrollmentStatus === "completed" && enrollmentId) {
    return (
      <div className="mt-4">
        {showReminder && reminder && <EnrollmentReminder message={reminder} />}
        <Link
          href="/profile/courses"
          className="flex min-h-11 w-full items-center justify-center rounded-full bg-accent px-4 py-3 text-sm font-medium text-white hover:opacity-90"
        >
          Download certificate
        </Link>
      </div>
    );
  }

  if (isEnrolled) {
    return (
      <div className="mt-4">
        {showReminder && reminder && <EnrollmentReminder message={reminder} />}
        <Link
          href="/profile/courses"
          className="flex min-h-11 w-full items-center justify-center rounded-full border border-primary bg-primary/5 px-4 py-3 text-sm font-medium text-primary"
        >
          Enrolled — View My Profile
        </Link>
      </div>
    );
  }

  if (enrollmentStatus === "pending_verification") {
    return (
      <div className="mt-4">
        {showReminder && reminder && <EnrollmentReminder message={reminder} />}
        <Link
          href="/profile/courses?pending=1"
          className="flex min-h-11 w-full items-center justify-center rounded-full border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900"
        >
          Payment submitted — Awaiting verification
        </Link>
      </div>
    );
  }

  if (enrollmentStatus === "payment_declined" && enrollmentId) {
    return (
      <div className="mt-4">
        {showReminder && reminder && <EnrollmentReminder message={reminder} />}
        <Link
          href={`/payment/${enrollmentId}`}
          className="flex min-h-11 w-full flex-col items-center justify-center rounded-full border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-900 transition-colors hover:bg-red-100 sm:flex-row sm:gap-2"
        >
          <span>Resubmit payment</span>
          <span className="text-red-800/90">· {formatPrice(registrationFeePaise)} reg.</span>
        </Link>
      </div>
    );
  }

  if (enrollmentStatus === "pending" && enrollmentId) {
    return (
      <div className="mt-4">
        {showReminder && reminder && <EnrollmentReminder message={reminder} />}
        <Link
          href={`/payment/${enrollmentId}`}
          className="flex min-h-11 w-full flex-col items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-light sm:flex-row sm:gap-2"
        >
          <span>Complete payment</span>
          <span className="text-white/90">· {formatPrice(registrationFeePaise)} reg.</span>
        </Link>
      </div>
    );
  }

  if (enrollmentClosedMessage && !isEnrolled && !enrollmentStatus) {
    return (
      <div className="mt-4">
        <p
          className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-center text-sm text-amber-900"
          role="status"
        >
          {enrollmentClosedMessage}
        </p>
      </div>
    );
  }

  async function handleEnroll() {
    setError("");
    setInfo("");
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

      if (res.status === 403 && data.profileIncomplete) {
        window.location.href = data.redirectUrl ?? PROFILE_COMPLETE_REDIRECT;
        return;
      }

      if (res.status === 400 && data.alreadyEnrolled) {
        setError(data.error || "You are already enrolled in this course.");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setError(data.error || "Could not start payment.");
        setLoading(false);
        return;
      }

      if (data.paymentUrl) {
        if (data.message) {
          setInfo(data.message);
        }
        window.location.href = data.paymentUrl;
        return;
      }

      setError("Payment page not received.");
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
        className="mt-4 flex min-h-11 w-full flex-col items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-light sm:flex-row sm:gap-2"
      >
        <span>Sign in to Enroll</span>
        <span className="text-white/90">· {formatPrice(registrationFeePaise)} reg.</span>
      </Link>
    );
  }

  if (!profileComplete) {
    return (
      <div className="mt-4">
        <p className="mb-2 text-center text-xs text-amber-900" role="status">
          Complete your profile to enroll in this course.
        </p>
        <Link
          href={PROFILE_COMPLETE_REDIRECT}
          className="flex min-h-11 w-full flex-col items-center justify-center rounded-full border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-950 transition-colors hover:bg-amber-100 sm:flex-row sm:gap-2"
        >
          <span>Complete profile to enroll</span>
          <span className="text-amber-800/90">· {formatPrice(registrationFeePaise)} reg.</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-4">
      {error && (
        <p className="mb-2 text-center text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
      {info && (
        <p className="mb-2 text-center text-xs text-violet-800" role="status">
          {info}
        </p>
      )}
      <button
        type="button"
        onClick={handleEnroll}
        disabled={loading}
        className="flex min-h-11 w-full flex-col items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-light active:bg-primary-light disabled:opacity-60 sm:flex-row sm:gap-2"
      >
        <span>{loading ? "Loading…" : "Pay registration fee"}</span>
        <span className="text-white/90">· {formatPrice(registrationFeePaise)}</span>
      </button>
    </div>
  );
}
