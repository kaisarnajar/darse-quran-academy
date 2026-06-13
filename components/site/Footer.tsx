import Link from "next/link";
import { SiteLogo } from "@/components/site/SiteLogo";
import { FacebookIcon, InstagramIcon, YouTubeIcon } from "@/components/site/SocialIcons";
import {
  buildWhatsAppHref,
  formatWhatsAppForDisplay,
  getConfiguredSocialNetworkLinks,
  getSocialLinksSettings,
} from "@/lib/social-links";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/courses", label: "Courses" },
  { href: "/announcements", label: "Announcements" },
  { href: "/library", label: "Resources" },
  { href: "/fatwa", label: "Fatwa" },
  { href: "/teachers", label: "Teachers" },
];

const DEVELOPER_WHATSAPP_NUMBER = "917006025120";
const developerWhatsAppHref = buildWhatsAppHref(DEVELOPER_WHATSAPP_NUMBER);
const developerWhatsAppDisplay = formatWhatsAppForDisplay(DEVELOPER_WHATSAPP_NUMBER);

const SUPPORTER_WHATSAPP_NUMBER = "917006079324";
const supporterWhatsAppHref = buildWhatsAppHref(SUPPORTER_WHATSAPP_NUMBER);
const supporterWhatsAppDisplay = formatWhatsAppForDisplay(SUPPORTER_WHATSAPP_NUMBER);

type FooterCreditBlockProps = {
  title: string;
  name: string;
  email: string;
  emailHref: string;
  whatsappHref: string;
  whatsappDisplay: string;
  linkedInHref: string;
  linkedInLabel: string;
};

function FooterCreditBlock({
  title,
  name,
  email,
  emailHref,
  whatsappHref,
  whatsappDisplay,
  linkedInHref,
  linkedInLabel,
}: FooterCreditBlockProps) {
  return (
    <div className="text-center sm:text-right">
      <p className="font-medium text-white/90">{title}</p>
      <p className="mt-1 text-white/80">{name}</p>
      <p className="mt-1">
        <a href={emailHref} className="transition-colors hover:text-gold">
          {email}
        </a>
      </p>
      <p className="mt-1">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-gold"
        >
          {whatsappDisplay}
        </a>
      </p>
      <p className="mt-1">
        <a
          href={linkedInHref}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-gold"
        >
          {linkedInLabel}
        </a>
      </p>
    </div>
  );
}

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
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row sm:items-start">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} Darse Quran Academy. All rights reserved.
          </p>
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-10 lg:gap-16">
            <FooterCreditBlock
              title="Developed & Maintained by"
              name="Kaisar Ahmad Najar"
              email="kaisarnajar11114@gmail.com"
              emailHref="mailto:kaisarnajar11114@gmail.com"
              whatsappHref={developerWhatsAppHref}
              whatsappDisplay={developerWhatsAppDisplay}
              linkedInHref="https://www.linkedin.com/in/kaisarnajar/"
              linkedInLabel="linkedin.com/in/kaisarnajar"
            />
            <FooterCreditBlock
              title="Supported by"
              name="Barkat Bashir Malik"
              email="barkatbashir4@gmail.com"
              emailHref="mailto:barkatbashir4@gmail.com"
              whatsappHref={supporterWhatsAppHref}
              whatsappDisplay={supporterWhatsAppDisplay}
              linkedInHref="https://www.linkedin.com/in/barkat-bashir-070a68178/"
              linkedInLabel="linkedin.com/in/barkat-bashir-070a68178"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
