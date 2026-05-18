"use client";

import type { Occupation } from "@prisma/client";
import { useActionState } from "react";
import { updateProfile, type ProfileUpdateState } from "@/app/profile/actions";
import { OCCUPATION_OPTIONS } from "@/lib/profile";
import { inputClassName, labelClassName } from "@/lib/form";

type ProfileFormProps = {
  name: string | null;
  email: string;
  fatherName: string | null;
  dateOfBirth: string;
  occupation: Occupation | null;
  address: string | null;
  whatsapp: string | null;
};

const initialState: ProfileUpdateState = {};

export function ProfileForm({
  name,
  email,
  fatherName,
  dateOfBirth,
  occupation,
  address,
  whatsapp,
}: ProfileFormProps) {
  const [state, formAction, pending] = useActionState(updateProfile, initialState);

  return (
    <form action={formAction} className="card-elevated max-w-lg space-y-4 p-5 sm:p-6">
      <div>
        <h2 className="font-serif text-lg font-semibold text-primary">Registration details</h2>
        <p className="mt-1 text-sm text-muted">
          Required when you enroll in a course. Email is used to sign in and cannot be changed here.
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
        <label htmlFor="fatherName" className={labelClassName}>
          Father&apos;s name
        </label>
        <input
          id="fatherName"
          name="fatherName"
          type="text"
          required
          defaultValue={fatherName ?? ""}
          className={inputClassName}
          autoComplete="off"
        />
      </div>

      <div>
        <label htmlFor="dateOfBirth" className={labelClassName}>
          Date of birth
        </label>
        <input
          id="dateOfBirth"
          name="dateOfBirth"
          type="date"
          required
          defaultValue={dateOfBirth}
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="occupation" className={labelClassName}>
          Occupation
        </label>
        <select
          id="occupation"
          name="occupation"
          required
          defaultValue={occupation ?? ""}
          className={inputClassName}
        >
          <option value="" disabled>
            Select…
          </option>
          {OCCUPATION_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="address" className={labelClassName}>
          Address
        </label>
        <textarea
          id="address"
          name="address"
          required
          rows={3}
          defaultValue={address ?? ""}
          className={inputClassName}
          autoComplete="street-address"
        />
      </div>

      <div>
        <label htmlFor="whatsapp" className={labelClassName}>
          WhatsApp number
        </label>
        <input
          id="whatsapp"
          name="whatsapp"
          type="tel"
          required
          defaultValue={whatsapp ?? ""}
          className={inputClassName}
          autoComplete="tel"
          placeholder="e.g. 9876543210"
        />
      </div>

      <div>
        <label htmlFor="email" className={labelClassName}>
          Email ID
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
        {pending ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}
