"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const links = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/announcements", label: "Announcements" },
  { href: "/admin/courses", label: "Courses" },
  { href: "/admin/enrollments", label: "Enrollments" },
  { href: "/admin/students", label: "Students" },
  { href: "/admin/teachers", label: "Teachers" },
  { href: "/admin/library", label: "Library" },
  { href: "/admin/fatwa", label: "Fatwa" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-b border-border bg-surface md:w-56 md:border-b-0 md:border-r">
      <div className="p-4">
        <p className="font-serif text-lg font-bold text-primary">Admin Panel</p>
        <p className="text-xs text-muted">Darse Quran Academy</p>
      </div>
      <nav className="flex flex-col gap-0.5 px-2 pb-4 md:px-3" aria-label="Admin navigation">
        {links.map((link) => {
          const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium ${
                active ? "bg-primary text-white shadow-sm" : "text-foreground hover:bg-accent-muted/50"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
        <Link
          href="/"
          className="mt-2 rounded-md px-3 py-2 text-sm font-medium text-muted hover:bg-accent-muted/50"
        >
          ← Back to site
        </Link>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="mt-1 rounded-md px-3 py-2 text-left text-sm font-medium text-muted hover:bg-accent-muted/50"
        >
          Sign out
        </button>
      </nav>
    </aside>
  );
}
