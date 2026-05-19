"use client";

import { useActionState, useState } from "react";
import {
  adminEnrollUser,
  previewStudentAccountForEnrollment,
  type AdminEnrollUserState,
} from "@/app/admin/enrollments/actions";
import { inputClassName, labelClassName } from "@/lib/form";
import type { Course } from "@prisma/client";

type AdminEnrollUserFormProps = {
  courses: Pick<Course, "id" | "title">[];
};

const initialState: AdminEnrollUserState = {};

export function AdminEnrollUserForm({ courses }: AdminEnrollUserFormProps) {
  const [state, formAction, pending] = useActionState(adminEnrollUser, initialState);
  const [email, setEmail] = useState("");
  const [linkedName, setLinkedName] = useState("");
  const [lookupError, setLookupError] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);

  async function runLookup(targetEmail: string) {
    const trimmed = targetEmail.trim();
    if (!trimmed) {
      setLinkedName("");
      setLookupError("");
      return;
    }

    setLookupLoading(true);
    setLookupError("");
    try {
      const result = await previewStudentAccountForEnrollment(trimmed);
      if (result.ok) {
        setLinkedName(result.name);
        setLookupError("");
      } else {
        setLinkedName("");
        setLookupError(result.error);
      }
    } catch {
      setLookupError("Could not verify this email. Try again.");
      setLinkedName("");
    } finally {
      setLookupLoading(false);
    }
  }

  const canSubmit = !lookupError && (email.trim().length === 0 || Boolean(linkedName));

  return (
    <form action={formAction} className="card-elevated space-y-4 p-5 sm:p-6">
      <div>
        <h2 className="font-serif text-lg font-semibold text-primary">Enroll a student manually</h2>
        <p className="mt-1 text-sm text-muted">
          The student must already have registered on the site. Verify their email, choose a course, then enroll
          them. Check &quot;Mark as paid&quot; to grant immediate access without UPI verification.
        </p>
      </div>

      {state.error && (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="rounded-md bg-violet-50 px-4 py-3 text-sm text-violet-800">{state.success}</p>
      )}

      <div>
        <label htmlFor="email" className={labelClassName}>
          Registered account email
        </label>
        <div className="mt-1 flex flex-col gap-2 sm:flex-row">
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => runLookup(email)}
            placeholder="student@example.com"
            className={`${inputClassName} flex-1`}
          />
          <button
            type="button"
            onClick={() => runLookup(email)}
            disabled={lookupLoading}
            className="min-h-11 shrink-0 rounded-md border border-border bg-surface px-4 text-sm font-medium text-foreground hover:bg-background disabled:opacity-60"
          >
            {lookupLoading ? "Checking…" : "Verify account"}
          </button>
        </div>
        <p className="mt-1.5 text-xs text-muted">
          The student must sign up on the site before you can enroll them in a course.
        </p>
        {lookupError && (
          <p className="mt-2 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-900" role="alert">
            {lookupError}
          </p>
        )}
      </div>

      <div>
        <label className={labelClassName}>Name (from account)</label>
        <p
          className={`mt-1 rounded-md border border-border bg-background/60 px-3 py-2.5 text-sm ${
            linkedName ? "font-medium text-foreground" : "text-muted"
          }`}
          aria-live="polite"
        >
          {linkedName || "Verify the email above to load the account name."}
        </p>
      </div>

      <div>
        <label htmlFor="courseId" className={labelClassName}>
          Course
        </label>
        <select id="courseId" name="courseId" required className={inputClassName} defaultValue="">
          <option value="" disabled>
            Select a course
          </option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="upiTransactionId" className={labelClassName}>
          UPI UTR (optional)
        </label>
        <input
          id="upiTransactionId"
          name="upiTransactionId"
          type="text"
          minLength={8}
          maxLength={50}
          placeholder="Bank reference / UTR if paid offline"
          className={inputClassName}
        />
      </div>

      <label className="flex cursor-pointer items-start gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          name="markAsPaid"
          className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
        />
        <span>
          <span className="font-medium">Mark as paid</span>
          <span className="block text-muted">Activate enrollment immediately (waive UPI verification).</span>
        </span>
      </label>

      <button
        type="submit"
        disabled={pending || !canSubmit}
        className="min-h-11 rounded-md bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Saving…" : "Enroll student"}
      </button>
    </form>
  );
}
