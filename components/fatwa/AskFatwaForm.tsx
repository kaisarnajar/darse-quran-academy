"use client";

import { useActionState } from "react";
import { submitFatwaQuestion, type SubmitFatwaState } from "@/app/fatwa/actions";
import { FATWA_CATEGORIES } from "@/lib/fatwa";

type AskFatwaFormProps = {
  defaultName?: string;
  defaultEmail?: string;
  isLoggedIn?: boolean;
};

const initialState: SubmitFatwaState = {};

export function AskFatwaForm({ defaultName = "", defaultEmail = "", isLoggedIn = false }: AskFatwaFormProps) {
  const [state, formAction, pending] = useActionState(submitFatwaQuestion, initialState);

  return (
    <form action={formAction} className="card-elevated space-y-5 p-6 sm:p-8">
      {state.error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {state.error}
        </p>
      )}

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-foreground">
          Category
        </label>
        <select
          id="category"
          name="category"
          required
          className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          defaultValue=""
        >
          <option value="" disabled>
            Select a topic
          </option>
          {FATWA_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-foreground">
          Subject
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          minLength={10}
          maxLength={200}
          placeholder="Brief summary of your question"
          className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label htmlFor="question" className="block text-sm font-medium text-foreground">
          Your question
        </label>
        <textarea
          id="question"
          name="question"
          required
          minLength={30}
          maxLength={5000}
          rows={6}
          placeholder="Describe your question in detail (Islam, Atheism, general fatwa, etc.)"
          className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>

      {!isLoggedIn && (
        <>
          <div>
            <label htmlFor="askerName" className="block text-sm font-medium text-foreground">
              Your name
            </label>
            <input
              id="askerName"
              name="askerName"
              type="text"
              required
              defaultValue={defaultName}
              className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label htmlFor="askerEmail" className="block text-sm font-medium text-foreground">
              Email
            </label>
            <p className="mt-0.5 text-xs text-muted">We will email you when your question is answered.</p>
            <input
              id="askerEmail"
              name="askerEmail"
              type="email"
              required
              defaultValue={defaultEmail}
              className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </>
      )}

      {isLoggedIn && (
        <>
          <input type="hidden" name="askerName" value={defaultName} />
          <input type="hidden" name="askerEmail" value={defaultEmail} />
          <p className="text-sm text-muted">
            Submitting as <span className="font-medium text-foreground">{defaultName}</span> ({defaultEmail}
            ). We will email you when answered.
          </p>
        </>
      )}

      <button
        type="submit"
        disabled={pending}
        className="min-h-11 w-full rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-light disabled:opacity-60"
      >
        {pending ? "Submitting…" : "Submit question"}
      </button>
    </form>
  );
}
