"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export function AuthNav({ mobile = false }: { mobile?: boolean }) {
  const { data: session, status } = useSession();

  const linkClass = mobile
    ? "flex min-h-11 items-center rounded-md px-3 text-base font-medium text-foreground active:bg-accent-muted/50"
    : "whitespace-nowrap rounded-md px-2 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-accent-muted/50 hover:text-primary xl:px-2.5 xl:text-sm";

  if (status === "loading") {
    return (
      <span className={`${linkClass} text-muted`} aria-hidden>
        …
      </span>
    );
  }

  if (session?.user) {
    return (
      <div className={mobile ? "flex flex-col" : "flex items-center gap-0.5"}>
        {session.user.role === "ADMIN" && (
          <Link href="/admin" className={linkClass}>
            Admin
          </Link>
        )}
        {session.user.role === "TEACHER" && (
          <Link href="/teacher" className={linkClass}>
            {mobile ? "Teacher portal" : "Teacher"}
          </Link>
        )}
        {session.user.role !== "TEACHER" && (
          <Link href="/profile" className={linkClass}>
            {mobile ? "My Profile" : "Profile"}
          </Link>
        )}
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className={`${linkClass} ${mobile ? "w-full text-left" : ""}`}
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className={mobile ? "flex flex-col gap-1" : "flex items-center gap-1"}>
      <Link href="/login" className={linkClass}>
        Sign In
      </Link>
      <Link
        href="/register"
        className={
          mobile
            ? "flex min-h-11 items-center rounded-full bg-primary px-3 text-base font-medium text-white"
            : "whitespace-nowrap rounded-full bg-primary px-2.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-light xl:px-3 xl:text-sm"
        }
      >
        Register
      </Link>
    </div>
  );
}
