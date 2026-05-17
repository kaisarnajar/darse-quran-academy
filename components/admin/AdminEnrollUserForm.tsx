"use client";

import { useActionState } from "react";
import { adminEnrollUser, type AdminEnrollUserState } from "@/app/admin/enrollments/actions";
import { inputClassName, labelClassName } from "@/lib/form";
import type { Course } from "@prisma/client";

type AdminEnrollUserFormProps = {
  courses: Pick<Course, "id" | "title">[];
};

const initialState: AdminEnrollUserState = {};

export function AdminEnrollUserForm({ courses }: AdminEnrollUserFormProps) {
  const [state, formAction, pending] = useActionState(adminEnrollUser, initialState);

  return (
    <form action={formAction} className="card-elevated space-y-4 p-5 sm:p-6">
      <div>
        <h2 className="font-serif text-lg font-semibold text-primary">Enroll a student manually</h2>
        <p className="mt-1 text-sm text-muted">
          Add an existing user to any course. Check &quot;Mark as paid&quot; to grant immediate access without UPI
          verification.
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
          Student email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="student@example.com"
          className={inputClassName}
        />
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
        disabled={pending}
        className="min-h-11 rounded-md bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-light disabled:opacity-60"
      >
        {pending ? "Saving…" : "Enroll student"}
      </button>
    </form>
  );
}
