import Link from "next/link";
import { SiteLogo } from "@/components/site/SiteLogo";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/courses", label: "Courses" },
  { href: "/library", label: "Resources" },
  { href: "/fatwa", label: "Fatwa" },
  { href: "/teachers", label: "Teachers" },
];

export function Footer() {
  return (
    <footer className="mt-auto bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <SiteLogo href="/" className="h-14 sm:h-16" />
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Dedicated to authentic Islamic education—Quran, Arabic, and Islamic studies for all
              ages, taught online by qualified scholars.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-foreground">Quick Links</p>
            <ul className="mt-4 space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div id="contact">
            <p className="text-sm font-bold uppercase tracking-wide text-foreground">Contact</p>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              <li>
                <a href="mailto:info@darsequranacademy.org" className="hover:text-gold">
                  info@darsequranacademy.org
                </a>
              </li>
              <li>
                <a href="https://wa.me/917006025120" className="hover:text-gold">
                  +91 70060 25120
                </a>
              </li>
              <li>Online — serving students worldwide</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-[#1a1a1a] py-4 text-center text-xs text-white/70">
        © {new Date().getFullYear()} Darse Quran Academy. All rights reserved.
      </div>
    </footer>
  );
}
