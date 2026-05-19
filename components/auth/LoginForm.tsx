"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { authContinueUrl, getPostLoginPath } from "@/lib/auth-redirect";

export function LoginForm({ googleEnabled }: { googleEnabled: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const registered = searchParams.get("registered") === "1";
  const teacherProfileError = searchParams.get("error") === "teacher-profile";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    const sessionRes = await fetch("/api/auth/session", { credentials: "include" });
    const sessionData = await sessionRes.json();
    router.push(getPostLoginPath(sessionData?.user?.role, callbackUrl));
    router.refresh();
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <h1 className="text-center font-serif text-2xl font-bold text-primary sm:text-3xl">Sign In</h1>
      <p className="mt-2 text-center text-sm text-muted">
        Students and instructors use the same sign-in. After the academy links your registered email as a
        teacher, you will open the teacher portal when you sign in.
      </p>

      {registered && (
        <p className="mt-4 rounded-xl bg-violet-50 px-4 py-3 text-center text-sm text-violet-800">
          Account created. Please sign in.
        </p>
      )}

      {teacherProfileError && (
        <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-center text-sm text-amber-900">
          Your account is not linked as a teacher yet. Register first if needed, then ask the academy admin to
          add your registered email to the teacher list.
        </p>
      )}

      {error && (
        <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-center text-sm text-red-800" role="alert">
          {error}
        </p>
      )}

      <div className="mt-6 space-y-4">
        {googleEnabled && <GoogleSignInButton callbackUrl={authContinueUrl(callbackUrl)} />}

        {googleEnabled && (
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="min-h-11 w-full rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-light disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in with Email"}
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link
          href={`/register?callbackUrl=${encodeURIComponent(callbackUrl)}`}
          className="font-medium text-primary hover:underline"
        >
          Register
        </Link>
      </p>
    </div>
  );
}
