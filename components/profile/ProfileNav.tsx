"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/profile", label: "Profile", exact: true },
  { href: "/profile/courses", label: "My Courses" },
  { href: "/profile/payments", label: "Payments" },
  { href: "/profile/payment-info", label: "Payment info" },
];

export function ProfileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex flex-wrap gap-2 border-b border-border pb-4"
      aria-label="Profile sections"
    >
      {links.map((link) => {
        const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-primary text-white"
                : "border border-border text-foreground hover:bg-accent-muted/50"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
