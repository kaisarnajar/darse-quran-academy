import Link from "next/link";
import { SiteLogo } from "@/components/site/SiteLogo";
import { FacebookIcon, InstagramIcon, YouTubeIcon } from "@/components/site/SocialIcons";
import { getFlaticonCourseIconAttributions } from "@/lib/flaticon-course-icons";
import {
  buildWhatsAppHref,
  formatWhatsAppForDisplay,
  getConfiguredSocialNetworkLinks,
  getSocialLinksSettings,
} from "@/lib/social-links";

const flaticonAttributions = getFlaticonCourseIconAttributions();

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/courses", label: "Courses" },
  { href: "/announcements", label: "Announcements" },
  { href: "/library", label: "Resources" },
  { href: "/fatwa", label: "Fatwa" },
  { href: "/teachers", label: "Teachers" },
];

export async function Footer() {
  const settings = await getSocialLinksSettings();
  const whatsappHref = buildWhatsAppHref(settings.whatsappNumber, settings.whatsappDefaultMessage);
  const whatsappDisplay = formatWhatsAppForDisplay(settings.whatsappNumber);
  const socialLinks = getConfiguredSocialNetworkLinks(settings);

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
              {settings.contactEmail && (
                <li>
                  <a href={`mailto:${settings.contactEmail}`} className="hover:text-gold">
                    {settings.contactEmail}
                  </a>
                </li>
              )}
              {settings.whatsappNumber && (
                <li>
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                    {whatsappDisplay}
                  </a>
                </li>
              )}
              <li>Online — serving students worldwide</li>
            </ul>
            {socialLinks.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground transition-colors hover:border-gold hover:text-gold"
                  >
                    {link.label === "Facebook" && <FacebookIcon className="h-3.5 w-3.5" />}
                    {link.label === "Instagram" && <InstagramIcon className="h-3.5 w-3.5" />}
                    {link.label === "YouTube" && <YouTubeIcon className="h-3.5 w-3.5" />}
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 bg-[#1a1a1a] px-4 py-5 text-xs text-white/70 sm:px-6">
        <div className="mx-auto max-w-6xl pb-4 text-center text-white/55 sm:text-left">
          <p>
            Course category icons made by{" "}
            {flaticonAttributions.map((attribution, index) => (
              <span key={attribution.author}>
                {index > 0 && (index === flaticonAttributions.length - 1 ? " and " : ", ")}
                <a
                  href={attribution.authorUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-gold"
                >
                  {attribution.author}
                </a>
              </span>
            ))}{" "}
            from{" "}
            <a
              href="https://www.flaticon.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-gold"
            >
              www.flaticon.com
            </a>
          </p>
        </div>
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
          </div>
        </div>
      </div>
    </footer>
  );
}
