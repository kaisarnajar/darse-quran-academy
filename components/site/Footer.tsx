import Link from "next/link";
import { SiteLogo } from "@/components/site/SiteLogo";

const footerLinks = [
  { href: "/courses", label: "Courses" },
  { href: "/library", label: "Library" },
  { href: "/fatwa", label: "Fatwa" },
  { href: "/teachers", label: "Teachers" },
  { href: "/about", label: "About" },
];

export function Footer() {
  return (
    <footer className="mt-auto cta-gradient text-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-2 sm:text-left lg:grid-cols-3">
          <div>
            <SiteLogo href="/" className="mx-auto h-14 sm:mx-0 sm:h-16" />
            <p className="mt-4 text-sm leading-relaxed text-violet-100">
              Dedicated to authentic Islamic education—Quran, Arabic, and Islamic studies for all ages.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-amber-200">Quick Links</p>
            <ul className="mt-3 space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-10 items-center text-sm text-violet-100 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="text-sm font-semibold uppercase tracking-wide text-amber-200">Contact</p>
            <ul className="mt-3 space-y-2 text-sm text-violet-100">
              <li className="break-all">info@darsequranacademy.org</li>
              <li>+91 98765 43210</li>
              <li>Online — serving students worldwide</li>
            </ul>
          </div>
        </div>
        <p className="mt-8 border-t border-white/15 pt-6 text-center text-xs text-violet-200/80">
          © {new Date().getFullYear()} Darse Quran Academy. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
