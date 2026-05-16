import Link from "next/link";

const footerLinks = [
  { href: "/courses", label: "Courses" },
  { href: "/library", label: "Library" },
  { href: "/teachers", label: "Teachers" },
  { href: "/about", label: "About" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-primary text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-2 sm:text-left lg:grid-cols-3">
          <div>
            <p className="font-serif text-lg font-bold">Darse Quran Academy</p>
            <p className="mt-2 text-sm leading-relaxed text-white/80">
              Dedicated to authentic Islamic education—Quran, Arabic, and Islamic studies for all ages.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">Quick Links</p>
            <ul className="mt-3 space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-10 items-center text-sm text-white/80 transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">Contact</p>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              <li className="break-all">info@darsequranacademy.org</li>
              <li>+91 98765 43210</li>
              <li>Deoband, Uttar Pradesh, India</li>
            </ul>
          </div>
        </div>
        <p className="mt-6 border-t border-white/20 pt-6 text-center text-xs text-white/60 sm:mt-8">
          © {new Date().getFullYear()} Darse Quran Academy. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
