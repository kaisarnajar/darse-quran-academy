"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthNav } from "@/components/auth/AuthNav";
import { SiteLogo } from "@/components/site/SiteLogo";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/library", label: "Library" },
  { href: "/fatwa", label: "Fatwa" },
  { href: "/teachers", label: "Teachers" },
  { href: "/about", label: "About" },
];

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-surface/90 shadow-sm shadow-primary/5 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:gap-3 sm:px-6">
        <div className="flex min-w-0 flex-1 items-center pr-1 sm:pr-2 md:flex-none">
          <SiteLogo priority />
        </div>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-2 text-sm font-medium transition-all ${
                  active
                    ? "bg-primary text-white shadow-sm"
                    : "text-foreground hover:bg-accent-muted hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="ml-2 flex items-center gap-1 border-l border-border pl-2">
            <AuthNav />
          </div>
        </nav>

        <button
          type="button"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-primary hover:bg-accent-muted md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <nav
          id="mobile-menu"
          className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-border bg-surface px-4 py-2 md:hidden"
          aria-label="Mobile navigation"
        >
          <ul className="flex flex-col gap-0.5 pb-2">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`flex min-h-11 items-center rounded-lg px-3 text-base font-medium ${
                      active
                        ? "bg-primary text-white"
                        : "text-foreground active:bg-accent-muted"
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
            <li className="mt-2 border-t border-border pt-2">
              <div className="flex flex-col gap-0.5" onClick={() => setMenuOpen(false)} role="presentation">
                <AuthNav mobile />
              </div>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
