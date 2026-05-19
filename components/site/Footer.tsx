import Link from "next/link";
import { SiteLogo } from "@/components/site/SiteLogo";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/courses", label: "Courses" },
  { href: "/announcements", label: "Announcements" },
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
      <div className="border-t border-white/10 bg-[#1a1a1a] px-4 py-5 text-xs text-white/70 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row sm:items-start sm:gap-6">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} Darse Quran Academy. All rights reserved.
          </p>
          <div className="text-center sm:text-right">
            <p className="font-medium text-white/90">Developed & Maintained by</p>
            <p className="mt-1 text-white/80">Kaisar Ahmad Najar</p>
            <p className="mt-1">
              <a
                href="mailto:kaisarnajar11114@gmail.com"
                className="transition-colors hover:text-gold"
              >
                kaisarnajar11114@gmail.com
              </a>
            </p>
            <p className="mt-1">
              <a
                href="https://www.linkedin.com/in/kaisarnajar/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-gold"
              >
                linkedin.com/in/kaisarnajar
              </a>
            </p>
            <p className="mt-1">
              <a
                href="https://wa.me/917006025120"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-gold"
              >
                +917006025120
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
