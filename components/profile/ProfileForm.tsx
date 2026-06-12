"use client";

import type { Occupation } from "@prisma/client";
import { useActionState, useMemo, useState } from "react";
import { updateProfile, type ProfileUpdateState } from "@/app/profile/actions";
import { OCCUPATION_OPTIONS } from "@/lib/profile";
import { inputClassName, labelClassName } from "@/lib/form";
import { profileUpdateSchema } from "@/lib/validations";

type ProfileFormProps = {
  name: string | null;
  email: string;
  fatherName: string | null;
  dateOfBirth: string;
  occupation: Occupation | null;
  address: string | null;
  whatsapp: string | null;
};

type FormField = keyof typeof profileUpdateSchema.shape;

type ProfileFormValues = {
  name: string;
  fatherName: string;
  dateOfBirth: string;
  occupation: Occupation | "";
  address: string;
  whatsapp: string;
};

const FORM_FIELDS: FormField[] = [
  "name",
  "fatherName",
  "dateOfBirth",
  "occupation",
  "address",
  "whatsapp",
];

const initialState: ProfileUpdateState = {};

const errorTextClassName = "mt-1 text-sm text-red-700";

function fieldInputClass(hasError: boolean) {
  return hasError
    ? `${inputClassName} border-red-500 focus:border-red-500 focus:ring-red-500`
    : inputClassName;
}

function getFieldError(field: FormField, value: string): string | undefined {
  const result = profileUpdateSchema.shape[field].safeParse(value);
  if (result.success) {
    return undefined;
  }
  return result.error.issues[0]?.message;
}

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
  const [values, setValues] = useState<ProfileFormValues>({
    name: name ?? "",
    fatherName: fatherName ?? "",
    dateOfBirth,
    occupation: occupation ?? "",
    address: address ?? "",
    whatsapp: whatsapp ?? "",
  });
  const [touched, setTouched] = useState<Partial<Record<FormField, boolean>>>({});

  const errors = useMemo(() => {
    const next: Partial<Record<FormField, string>> = {};
    for (const field of FORM_FIELDS) {
      const message = getFieldError(field, values[field]);
      if (message) {
        next[field] = message;
      }
    }
    return next;
  }, [values]);

  const isValid = useMemo(() => profileUpdateSchema.safeParse(values).success, [values]);

  function updateField(field: FormField, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function markTouched(field: FormField) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function showError(field: FormField) {
    return Boolean(touched[field] && errors[field]);
  }

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
          value={values.name}
          onChange={(e) => updateField("name", e.target.value)}
          onBlur={() => markTouched("name")}
          aria-invalid={showError("name") || undefined}
          aria-describedby={showError("name") ? "name-error" : undefined}
          className={fieldInputClass(showError("name"))}
          autoComplete="name"
        />
        {showError("name") && (
          <p id="name-error" className={errorTextClassName} role="alert">
            {errors.name}
          </p>
        )}
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
          value={values.fatherName}
          onChange={(e) => updateField("fatherName", e.target.value)}
          onBlur={() => markTouched("fatherName")}
          aria-invalid={showError("fatherName") || undefined}
          aria-describedby={showError("fatherName") ? "fatherName-error" : undefined}
          className={fieldInputClass(showError("fatherName"))}
          autoComplete="off"
        />
        {showError("fatherName") && (
          <p id="fatherName-error" className={errorTextClassName} role="alert">
            {errors.fatherName}
          </p>
        )}
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
          value={values.dateOfBirth}
          onChange={(e) => {
            updateField("dateOfBirth", e.target.value);
            markTouched("dateOfBirth");
          }}
          onBlur={() => markTouched("dateOfBirth")}
          aria-invalid={showError("dateOfBirth") || undefined}
          aria-describedby={showError("dateOfBirth") ? "dateOfBirth-error" : undefined}
          className={fieldInputClass(showError("dateOfBirth"))}
        />
        {showError("dateOfBirth") && (
          <p id="dateOfBirth-error" className={errorTextClassName} role="alert">
            {errors.dateOfBirth}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="occupation" className={labelClassName}>
          Occupation
        </label>
        <select
          id="occupation"
          name="occupation"
          required
          value={values.occupation}
          onChange={(e) => {
            updateField("occupation", e.target.value);
            markTouched("occupation");
          }}
          onBlur={() => markTouched("occupation")}
          aria-invalid={showError("occupation") || undefined}
          aria-describedby={showError("occupation") ? "occupation-error" : undefined}
          className={fieldInputClass(showError("occupation"))}
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
        {showError("occupation") && (
          <p id="occupation-error" className={errorTextClassName} role="alert">
            {errors.occupation}
          </p>
        )}
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
          value={values.address}
          onChange={(e) => updateField("address", e.target.value)}
          onBlur={() => markTouched("address")}
          aria-invalid={showError("address") || undefined}
          aria-describedby={showError("address") ? "address-error" : undefined}
          className={fieldInputClass(showError("address"))}
          autoComplete="street-address"
        />
        {showError("address") && (
          <p id="address-error" className={errorTextClassName} role="alert">
            {errors.address}
          </p>
        )}
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
          value={values.whatsapp}
          onChange={(e) => updateField("whatsapp", e.target.value)}
          onBlur={() => markTouched("whatsapp")}
          aria-invalid={showError("whatsapp") || undefined}
          aria-describedby={showError("whatsapp") ? "whatsapp-error" : undefined}
          className={fieldInputClass(showError("whatsapp"))}
          autoComplete="tel"
          placeholder="e.g. 9876543210"
        />
        {showError("whatsapp") && (
          <p id="whatsapp-error" className={errorTextClassName} role="alert">
            {errors.whatsapp}
          </p>
        )}
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

      {isValid && (
        <button
          type="submit"
          disabled={pending}
          className="min-h-11 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-light disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save details"}
        </button>
      )}
    </form>
  );
}
