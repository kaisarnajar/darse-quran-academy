"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export function AuthNav({ mobile = false }: { mobile?: boolean }) {
  const { data: session, status } = useSession();

  const linkClass = mobile
    ? "flex min-h-11 items-center rounded-md px-3 text-base font-medium text-foreground active:bg-accent-muted/50"
    : "rounded-md px-2.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-muted/50 hover:text-primary lg:px-3";

  if (status === "loading") {
    return (
      <span className={`${linkClass} text-muted`} aria-hidden>
        …
      </span>
    );
  }

  if (session?.user) {
    return (
      <>
        {session.user.role === "ADMIN" && (
          <Link href="/admin" className={linkClass}>
            Admin
          </Link>
        )}
        <Link href="/my-courses" className={linkClass}>
          My Courses
        </Link>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className={`${linkClass} w-full text-left sm:w-auto`}
        >
          Sign Out
        </button>
      </>
    );
  }

  return (
    <>
      <Link href="/login" className={linkClass}>
        Sign In
      </Link>
      <Link
        href="/register"
        className={
          mobile
            ? "flex min-h-11 items-center rounded-full bg-primary px-3 text-base font-medium text-white"
            : "rounded-full bg-primary px-2.5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-light lg:px-3"
        }
      >
        Register
      </Link>
    </>
  );
}
