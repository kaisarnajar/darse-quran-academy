"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@/components/auth/SignOutButton";

const links = [
  { href: "/teacher", label: "My courses", exact: true },
  { href: "/teacher/blogs", label: "My blogs" },
];

export function TeacherSidebar({ teacherName }: { teacherName: string }) {
  const pathname = usePathname();

  return (
    <aside className="border-b border-border bg-surface md:w-60 md:border-b-0 md:border-r">
      <div className="border-b border-border bg-gradient-to-br from-teal to-teal-dark p-5 text-white">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/80">Teacher portal</p>
        <p className="mt-1 font-serif text-lg font-bold leading-tight">{teacherName}</p>
        <p className="mt-1 text-xs text-white/75">Darse Quran Academy</p>
      </div>
      <nav className="flex flex-col gap-0.5 px-2 py-4 md:px-3" aria-label="Teacher navigation">
        {links.map((link) => {
          const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2.5 text-sm font-medium ${
                active
                  ? "bg-teal text-white shadow-sm"
                  : "text-foreground hover:bg-accent-muted/50"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
        <Link
          href="/"
          className="mt-3 rounded-lg px-3 py-2 text-sm font-medium text-muted hover:bg-accent-muted/50"
        >
          ← Public site
        </Link>
        <SignOutButton className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-muted hover:bg-accent-muted/50">
          Sign out
        </SignOutButton>
      </nav>
    </aside>
  );
}
