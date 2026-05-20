import Link from "next/link";
import { hadithArabic, hadithAttribution, hadithEnglish } from "@/content/hadith-quote";
import { socialIconForLabel } from "@/components/site/SocialIcons";
import { indoPakArabic } from "@/lib/fonts/indo-pak-arabic";
import { getConfiguredSocialNetworkLinks, getSocialLinksSettings } from "@/lib/social-links";

export async function TopBar() {
  const settings = await getSocialLinksSettings();
  const socialLinks = getConfiguredSocialNetworkLinks(settings);

  return (
    <div className="bg-gold text-sm text-black">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-2 sm:flex-row sm:gap-4">
        <p className="flex min-w-0 flex-1 flex-wrap items-center justify-center gap-x-2 gap-y-0 text-center leading-snug sm:flex-nowrap sm:justify-start sm:gap-x-3 sm:text-left">
          <span
            lang="ar"
            dir="rtl"
            className={`${indoPakArabic.className} indo-pak-arabic text-base sm:text-lg`}
          >
            {hadithArabic}
          </span>
          <span className="mx-1.5 inline text-black/40 sm:mx-2" aria-hidden>
            —
          </span>
          <span className="text-[0.7rem] font-medium sm:text-xs">
            <span className="font-semibold">{hadithAttribution}:</span> &ldquo;{hadithEnglish}&rdquo;
          </span>
        </p>
        {socialLinks.length > 0 && (
          <div className="flex shrink-0 items-center gap-2">
            {socialLinks.map((link) => {
              const Icon = socialIconForLabel(link.label);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white transition-opacity hover:opacity-80"
                >
                  <Icon />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
