import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

type CourseCategoryIconProps = {
  category: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  sm: "h-10 w-10",
  md: "h-14 w-14",
  lg: "h-20 w-20",
} as const;

const stroke = {
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function getCategoryIconKey(category: string): string {
  const normalized = category.toLowerCase();

  if (normalized.includes("tajweed")) return "tajweed";
  if (normalized.includes("seerah")) return "seerah";
  if (normalized.includes("arabic")) return "arabic";
  if (normalized.includes("hifz")) return "hifz";
  if (normalized.includes("quran")) return "quran";
  if (normalized.includes("fiqh")) return "fiqh";
  if (normalized.includes("tafsir")) return "tafsir";
  if (normalized.includes("aqeedah")) return "aqeedah";
  if (normalized.includes("hadith")) return "hadith";
  if (normalized.includes("duas") || normalized.includes("adhkar")) return "duas";
  if (normalized.includes("islamic")) return "islamic";
  return "other";
}

function IslamicStar() {
  return (
    <path
      {...stroke}
      d="M12 4.5l1.4 2.8 3.1.4-2.2 2.2.5 3.1L12 11.8 9.2 13l.5-3.1-2.2-2.2 3.1-.4L12 4.5z"
    />
  );
}

function OpenMushaf({ children }: { children?: ReactNode }) {
  return (
    <>
      <path
        {...stroke}
        d="M5.5 6.5c3-1.2 6-1.2 6.5 0 0.5-1.2 3.5-1.2 6.5 0v11c-3 1.2-6 1.2-6.5 0-0.5 1.2-3.5 1.2-6.5 0V6.5z"
      />
      <path {...stroke} d="M12 6.5v11" />
      {children}
    </>
  );
}

function QuranIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <OpenMushaf>
        <path {...stroke} d="M7.5 10.5c1.2-.8 2.3-.8 3.5 0M14 10.5c1.2-.8 2.3-.8 3.5 0" />
        <path {...stroke} d="M8 14h3M13 14h3" />
      </OpenMushaf>
      <IslamicStar />
    </svg>
  );
}

function TajweedIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <OpenMushaf>
        <path {...stroke} d="M8 11.5h2.5M13.5 11.5H16M8 15h2M13.5 15H16" />
      </OpenMushaf>
      <path {...stroke} d="M4.5 8.5c1.2-1.5 2.5-2 4-2M19.5 8.5c-1.2-1.5-2.5-2-4-2" />
      <path {...stroke} d="M6 5.5c2 .8 4 .8 6 0s4-.8 6 0" />
    </svg>
  );
}

function HifzIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path {...stroke} d="M7 6.5h10a1.5 1.5 0 011.5 1.5v10.5H7V6.5z" />
      <path {...stroke} d="M7 6.5c1.5-.8 3-.8 5 0s3.5.8 5 0" />
      <path {...stroke} d="M12 6.5v12" />
      <path {...stroke} d="M9.5 11h5M9.5 14h5M9.5 17h3" />
      <path {...stroke} d="M12 3.5v1.5" />
      <path {...stroke} d="M10 4.5h4" />
      <circle {...stroke} cx="17.5" cy="16.5" r="2.25" />
      <circle {...stroke} cx="17.5" cy="16.5" r="0.75" fill="currentColor" />
    </svg>
  );
}

function SeerahIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path {...stroke} d="M6 18.5h12" />
      <path {...stroke} d="M8.5 18.5V10l2.5-2 2.5 2v8.5" />
      <path {...stroke} d="M8.5 10h7" />
      <path {...stroke} d="M12 8V5.5" />
      <path
        {...stroke}
        fill="currentColor"
        fillOpacity={0.2}
        d="M10.2 5.2a2.8 2.8 0 015.6 0c0 1.2-.8 2-1.4 2.4-.4.3-.9.5-1.4.5s-1-.2-1.4-.5c-.6-.4-1.4-1.2-1.4-2.4z"
      />
      <path {...stroke} d="M5.5 10.5V18M18.5 10.5V18" />
      <circle {...stroke} cx="5.5" cy="9.5" r="1" />
      <circle {...stroke} cx="18.5" cy="9.5" r="1" />
    </svg>
  );
}

function ArabicIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        {...stroke}
        d="M6.5 17.5c2.5-1 4-3.5 4.5-7 .3-2.2 1.2-3.8 2.5-4.8"
      />
      <path {...stroke} d="M11 9.5c2 .5 3.5 2 4.5 4.5 1 2.2 2.2 3.5 4 4" />
      <circle cx="8.5" cy="8" r="0.9" fill="currentColor" />
      <circle cx="15.5" cy="7" r="0.9" fill="currentColor" />
      <circle cx="18" cy="16.5" r="0.9" fill="currentColor" />
      <path {...stroke} d="M5 19.5h14" />
    </svg>
  );
}

function FiqhIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path {...stroke} d="M12 4.5v3" />
      <path {...stroke} d="M8.5 7.5h7" />
      <path {...stroke} d="M12 7.5v2.5" />
      <path {...stroke} d="M6.5 10.5h11" />
      <path {...stroke} d="M8 10.5v2.5c0 1.8 1.8 3.2 4 3.2s4-1.4 4-3.2v-2.5" />
      <path {...stroke} d="M9.5 18.5 12 20.5l2.5-2" />
      <path
        {...stroke}
        fill="currentColor"
        fillOpacity={0.15}
        d="M10.3 4.1a1.7 1.7 0 013.4 0c0 .7-.5 1.2-.9 1.4-.2.2-.5.3-.8.3s-.6-.1-.8-.3c-.4-.2-.9-.7-.9-1.4z"
      />
    </svg>
  );
}

function IslamicStudiesIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle {...stroke} cx="12" cy="12" r="8.25" />
      <path
        {...stroke}
        d="M12 5.5 13.8 9l4 .6-2.9 2.8.7 4L12 14.8 8.4 16.4l.7-4-2.9-2.8 4-.6L12 5.5z"
      />
      <path {...stroke} d="M12 8.2v7.6M9.1 12h5.8M10 10.2h4M10 13.8h4" />
    </svg>
  );
}

function TafsirIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <OpenMushaf>
        <path {...stroke} d="M8 11h2.5M13.5 11H16M8 14.5h2M13.5 14.5H16" />
      </OpenMushaf>
      <circle {...stroke} cx="17.5" cy="9" r="3.25" />
      <path {...stroke} d="M15.2 11.2 13 13.5" />
    </svg>
  );
}

function AqeedahIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        {...stroke}
        fill="currentColor"
        fillOpacity={0.18}
        d="M14.8 7.8a4.8 4.8 0 11-5.6 0 4.8 4.8 0 015.6 0z"
      />
      <path
        {...stroke}
        d="M14.8 7.8a4.8 4.8 0 11-5.6 0 4.8 4.8 0 015.6 0z"
      />
      <IslamicStar />
      <path {...stroke} d="M8.5 18.5h7" />
      <path {...stroke} d="M10 20.5h4" />
    </svg>
  );
}

function HadithIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path {...stroke} d="M7.5 6.5h9a2 2 0 012 2v8.5a2 2 0 01-2 2H10l-3.5 2v-12.5a2 2 0 012-2z" />
      <path {...stroke} d="M9.5 10.5h5M9.5 13.5h4.5M9.5 16.5h3.5" />
      <circle {...stroke} cx="16.5" cy="8.5" r="2" />
      <path {...stroke} d="M15.5 8.5h2M16.5 7.5v2" />
    </svg>
  );
}

function DuasIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        {...stroke}
        fill="currentColor"
        fillOpacity={0.15}
        d="M10.2 5.2a2.8 2.8 0 015.6 0c0 1.2-.8 2-1.4 2.4-.4.3-.9.5-1.4.5s-1-.2-1.4-.5c-.6-.4-1.4-1.2-1.4-2.4z"
      />
      <path
        {...stroke}
        d="M8.5 11.5c0-1.8 1.5-3.2 3.5-3.2s3.5 1.4 3.5 3.2v1.2c1.2.8 1.8 2 1.8 3.3 0 2.3-2.4 4-5.3 4s-5.3-1.7-5.3-4c0-1.3.6-2.5 1.8-3.3v-1.2z"
      />
      <path {...stroke} d="M7.5 13.5c-1 .7-1.5 1.7-1.5 2.8M16.5 13.5c1 .7 1.5 1.7 1.5 2.8" />
      <path {...stroke} d="M10.5 18.8v1.2M13.5 18.8v1.2" />
    </svg>
  );
}

function OtherIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        {...stroke}
        d="M12 3.5 14.2 8l4.8.7-3.5 3.4.8 4.8L12 14.3 7.7 16.9l.8-4.8-3.5-3.4 4.8-.7L12 3.5z"
      />
      <circle {...stroke} cx="12" cy="12" r="3.25" />
      <path {...stroke} d="M12 9.2v5.6M9.2 12h5.6" />
    </svg>
  );
}

const categoryIcons = {
  tajweed: TajweedIcon,
  seerah: SeerahIcon,
  arabic: ArabicIcon,
  hifz: HifzIcon,
  quran: QuranIcon,
  fiqh: FiqhIcon,
  islamic: IslamicStudiesIcon,
  tafsir: TafsirIcon,
  aqeedah: AqeedahIcon,
  hadith: HadithIcon,
  duas: DuasIcon,
  other: OtherIcon,
} as const;

export function CourseCategoryIcon({
  category,
  size = "md",
  className = "",
}: CourseCategoryIconProps) {
  const iconKey = getCategoryIconKey(category);
  const Icon = categoryIcons[iconKey as keyof typeof categoryIcons] ?? OtherIcon;

  return (
    <span
      role="img"
      aria-label={`${category} course`}
      className={`inline-flex items-center justify-center text-white/95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)] ${sizeClasses[size]} ${className}`}
    >
      <Icon className="h-full w-full" aria-hidden />
    </span>
  );
}
