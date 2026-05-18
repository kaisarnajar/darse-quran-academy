"use client";

import { useActionState } from "react";
import { updateProfile, type ProfileUpdateState } from "@/app/profile/actions";
import { inputClassName, labelClassName } from "@/lib/form";

type ProfileFormProps = {
  name: string | null;
  email: string;
};

const initialState: ProfileUpdateState = {};

export function ProfileForm({ name, email }: ProfileFormProps) {
  const [state, formAction, pending] = useActionState(updateProfile, initialState);

  return (
    <form action={formAction} className="card-elevated max-w-lg space-y-4 p-5 sm:p-6">
      <div>
        <h2 className="font-serif text-lg font-semibold text-primary">Your details</h2>
        <p className="mt-1 text-sm text-muted">Update your display name. Email is used to sign in and cannot be changed here.</p>
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
        <label htmlFor="name" className={labelClassName}>
          Full name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={name ?? ""}
          className={inputClassName}
          autoComplete="name"
        />
      </div>

      <div>
        <label htmlFor="email" className={labelClassName}>
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          readOnly
          className={`${inputClassName} cursor-not-allowed bg-background text-muted`}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="min-h-11 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-light disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
