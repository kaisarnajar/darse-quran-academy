"use client";

import type { Teacher } from "@prisma/client";
import { useState } from "react";
import { previewTeacherAccount } from "@/app/admin/teachers/actions";
import { deriveTeacherInitials } from "@/lib/teacher-admin";
import { inputClassName, labelClassName } from "@/lib/form";

type TeacherFormProps = {
  teacher?: Teacher;
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
  error?: string;
};

export function TeacherForm({ teacher, action, submitLabel, error }: TeacherFormProps) {
  const [email, setEmail] = useState(teacher?.email ?? "");
  const [linkedName, setLinkedName] = useState(teacher?.name ?? "");
  const [lookupError, setLookupError] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [initials, setInitials] = useState(teacher?.initials ?? "");

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
      const result = await previewTeacherAccount(trimmed, teacher?.id);
      if (result.ok) {
        setLinkedName(result.name);
        setLookupError("");
        if (!initials || !teacher) {
          setInitials(deriveTeacherInitials(result.name));
        }
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

  return (
    <form action={action} className="mx-auto max-w-2xl space-y-5">
      {error && (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {error}
        </p>
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
            placeholder="teacher@example.com"
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
          The teacher must already have signed up on the site. We use their account name automatically; you
          set specialization and profile details below.
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
        <label htmlFor="specialization" className={labelClassName}>
          Specialization
        </label>
        <input
          id="specialization"
          name="specialization"
          required
          defaultValue={teacher?.specialization}
          placeholder="e.g. Quran & Tajweed"
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="bio" className={labelClassName}>
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          required
          rows={4}
          defaultValue={teacher?.bio}
          className={inputClassName}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="initials" className={labelClassName}>
            Initials (avatar)
          </label>
          <input
            id="initials"
            name="initials"
            maxLength={4}
            value={initials}
            onChange={(e) => setInitials(e.target.value.toUpperCase())}
            placeholder="Auto from name"
            className={inputClassName}
          />
          <p className="mt-1 text-xs text-muted">Leave blank to auto-generate from the account name.</p>
        </div>
        <div>
          <label htmlFor="imageUrl" className={labelClassName}>
            Photo URL (optional)
          </label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="url"
            defaultValue={teacher?.imageUrl ?? ""}
            placeholder="https://..."
            className={inputClassName}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="published"
          defaultChecked={teacher?.published ?? true}
          className="h-4 w-4 rounded border-border"
        />
        Published on public Teachers page
      </label>

      {teacher && (
        <p className="text-xs text-muted">
          Profile ID: <code className="rounded bg-background px-1">{teacher.id}</code>
        </p>
      )}

      <button
        type="submit"
        disabled={Boolean(lookupError) || (email.trim().length > 0 && !linkedName)}
        className="min-h-11 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitLabel}
      </button>
    </form>
  );
}
