import type { SVGProps } from "react";

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

/** Open mushaf on a rehal — common Flaticon Quran motif. */
function QuranOnRehal() {
  return (
    <g fill="currentColor">
      <path d="M5.2 17.2 12 20.5l6.8-3.3V8.6L12 5.3 5.2 8.6v8.6z" opacity="0.92" />
      <path d="M12 5.3v15.2" opacity="0.35" />
      <path d="M7.4 9.8c1.4-.7 2.8-.7 4.6 0 1.8-.7 3.2-.7 4.6 0v6.8c-1.4.7-2.8.7-4.6 0-1.8.7-3.2.7-4.6 0V9.8z" />
      <path d="M4.4 18.8 12 22l7.6-3.2-1.1-2.5L12 19.3l-6.5-3-1.1 2.5z" />
    </g>
  );
}

function QuranIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <QuranOnRehal />
      <path
        fill="currentColor"
        d="M11.1 3.2a1.1 1.1 0 012 0l.5 1.5h1.6l-1.3 1 .5 1.6-1.3-1-1.3 1 .5-1.6-1.3-1H10.6l.5-1.5z"
        opacity="0.9"
      />
    </svg>
  );
}

function TajweedIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <QuranOnRehal />
      <path
        fill="currentColor"
        d="M3.2 8.3c1.4-1.6 3-2.4 4.8-2.4s3.4.8 4.8 2.4c-1.4 1.6-3 2.4-4.8 2.4S4.6 9.9 3.2 8.3z"
        opacity="0.85"
      />
      <path
        fill="currentColor"
        d="M11.4 6.2c.8-.4 1.6-.4 2.4 0 .8.4.8 1 0 1.4-.8.4-1.6.4-2.4 0-.8-.4-.8-1 0-1.4z"
      />
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M16.8 4.2c2.2 0 4 1.8 4 4v1.2h-1.4V8.2c0-1.4-1.1-2.6-2.6-2.6s-2.6 1.1-2.6 2.6v1.2h-1.4V8.2c0-2.2 1.8-4 4-4z"
        clipRule="evenodd"
        opacity="0.9"
      />
    </svg>
  );
}

function HifzIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        fill="currentColor"
        d="M7.2 6.8h9.6a1.2 1.2 0 011.2 1.2v9.2a1.2 1.2 0 01-1.2 1.2H7.2a1.2 1.2 0 01-1.2-1.2V8a1.2 1.2 0 011.2-1.2z"
      />
      <path fill="currentColor" d="M7.2 6.8c1.6-.8 3.2-.8 4.8 0 1.6-.8 3.2-.8 4.8 0v10.4c-1.6.8-3.2.8-4.8 0-1.6.8-3.2.8-4.8 0V6.8z" opacity="0.35" />
      <path fill="currentColor" d="M12 6.8v10.4" opacity="0.35" />
      <path
        fill="currentColor"
        d="M16.8 14.2a3.4 3.4 0 110 6.8 3.4 3.4 0 010-6.8zm0 1.2a2.2 2.2 0 100 4.4 2.2 2.2 0 000-4.4z"
      />
      <circle cx="16.8" cy="17.6" r="0.9" fill="currentColor" />
      <circle cx="15.3" cy="16.4" r="0.55" fill="currentColor" opacity="0.75" />
      <circle cx="18.3" cy="16.4" r="0.55" fill="currentColor" opacity="0.75" />
      <circle cx="16.8" cy="15.2" r="0.55" fill="currentColor" opacity="0.75" />
      <circle cx="15.3" cy="18.8" r="0.55" fill="currentColor" opacity="0.75" />
      <circle cx="18.3" cy="18.8" r="0.55" fill="currentColor" opacity="0.75" />
    </svg>
  );
}

function SeerahIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path fill="currentColor" d="M10.8 18.8h2.4v-7.2h-2.4v7.2z" />
      <path fill="currentColor" d="M7.2 18.8h9.6v1.4H7.2v-1.4z" />
      <path
        fill="currentColor"
        d="M8.4 11.6h7.2c0-2.8-1.6-4.8-3.6-4.8S8.4 8.8 8.4 11.6z"
      />
      <path
        fill="currentColor"
        d="M10.4 4.8a1.6 1.6 0 013.2 0c0 .7-.5 1.2-.9 1.5-.3.2-.7.4-1.1.4s-.8-.2-1.1-.4c-.4-.3-.9-.8-.9-1.5z"
      />
      <path fill="currentColor" d="M4.8 11.6h1.8v7.2H4.8V11.6z" />
      <path fill="currentColor" d="M17.4 11.6h1.8v7.2h-1.8V11.6z" />
      <circle cx="5.7" cy="10.4" r="1.1" fill="currentColor" />
      <circle cx="18.3" cy="10.4" r="1.1" fill="currentColor" />
      <path fill="currentColor" d="M5.4 9.3h.6v1.8h-.6V9.3zm12.6 0h.6v1.8h-.6V9.3z" />
    </svg>
  );
}

function ArabicIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        fill="currentColor"
        d="M6.2 18.4c2.4-1 3.8-3.4 4.2-6.6.3-2 .9-3.4 1.9-4.3 1.1-.9 2.4-1.2 3.7-.8 1.2.4 2.2 1.4 2.8 2.8.6 1.4.5 2.9-.2 4.1-.7 1.2-2 2-3.5 2.2-1.5.2-3-.2-4.1-1.2-1-1-1.5-2.4-1.5-3.9 0-1.2.3-2.3.9-3.2"
        opacity="0.95"
      />
      <circle cx="8.1" cy="7.4" r="1" fill="currentColor" />
      <circle cx="15.2" cy="6.5" r="1" fill="currentColor" />
      <circle cx="17.8" cy="16.8" r="1" fill="currentColor" />
      <path fill="currentColor" d="M5 19.8h14v1.2H5v-1.2z" opacity="0.5" />
    </svg>
  );
}

function FiqhIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path fill="currentColor" d="M11.4 4.2h1.2v3.4h-1.2V4.2z" />
      <path fill="currentColor" d="M8.2 7.2h7.6v1.4H8.2V7.2z" />
      <path fill="currentColor" d="M11.4 7.2h1.2v2.2h-1.2V7.2z" />
      <path fill="currentColor" d="M5.8 9.2h12.4v1.6H5.8V9.2z" />
      <path
        fill="currentColor"
        d="M7.4 10.8v2.4c0 2.2 2 4 4.6 4s4.6-1.8 4.6-4v-2.4H7.4z"
      />
      <path
        fill="currentColor"
        d="M9.8 18.4 12 20.8l2.2-2.4H9.8z"
      />
      <path
        fill="currentColor"
        d="M10.2 4a1.2 1.2 0 012.4 0c0 .5-.4.9-.7 1.1-.2.2-.5.3-.8.3s-.6-.1-.8-.3c-.3-.2-.7-.6-.7-1.1z"
        opacity="0.85"
      />
    </svg>
  );
}

function IslamicStudiesIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        fill="currentColor"
        d="M8.8 8.2h6.4l1.2 8.8H7.6l1.2-8.8z"
      />
      <path fill="currentColor" d="M7.2 17h9.6v1.6H7.2V17z" opacity="0.85" />
      <path
        fill="currentColor"
        d="M9.6 8.2 12 4.8l2.4 3.4H9.6z"
      />
      <path
        fill="currentColor"
        d="M11.1 3.4a.9.9 0 011.8 0l.4 1.1h1.2l-1 0.8.4 1.1-1-.8-1 .8.4-1.1-1-.8h1.2l.4-1.1z"
        opacity="0.9"
      />
    </svg>
  );
}

function TafsirIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <QuranOnRehal />
      <circle cx="17.4" cy="8.6" r="3.5" fill="currentColor" opacity="0.18" />
      <circle cx="17.4" cy="8.6" r="3.5" stroke="currentColor" strokeWidth="1.4" fill="none" />
      <path fill="currentColor" d="M15.2 10.8 12.8 13.2l-1-1 2.4-2.4 1 1z" />
    </svg>
  );
}

function AqeedahIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M15.2 8.2a4.8 4.8 0 11-6.4 0 4.8 4.8 0 016.4 0z"
        clipRule="evenodd"
      />
      <path
        fill="currentColor"
        d="M11.1 4.8a1 1 0 011.8 0l.4 1.3h1.4l-1.1 0.9.4 1.3-1.1-.9-1.1.9.4-1.3-1.1-.9h1.4l.4-1.3z"
      />
      <path fill="currentColor" d="M8.2 18.4h7.6v1.4H8.2v-1.4z" />
      <path fill="currentColor" d="M9.8 20h4.4v1.2H9.8V20z" opacity="0.75" />
    </svg>
  );
}

function HadithIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        fill="currentColor"
        d="M7.2 6.4h9.2a1.8 1.8 0 011.8 1.8v7.8a1.8 1.8 0 01-1.8 1.8H9.8L6 19.8V8.2a1.8 1.8 0 011.2-1.8z"
      />
      <path fill="currentColor" d="M9.2 10.2h5.6v1.2H9.2v-1.2zm0 2.8h4.8v1.2H9.2V13zm0 2.8h3.6v1.2H9.2v-1.2z" opacity="0.35" />
      <circle cx="16.8" cy="8.2" r="2.2" fill="currentColor" />
      <path fill="currentColor" d="M15.8 8.2h2v1.4h-2V8.2zm1-1v3.4h-.8V7.2h.8z" opacity="0.35" />
    </svg>
  );
}

function DuasIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        fill="currentColor"
        d="M10.2 5.2a2.4 2.4 0 014.8 0c0 1-.7 1.7-1.2 2-.3.2-.7.4-1.1.4s-.8-.2-1.1-.4c-.5-.3-1.2-1-1.2-2z"
      />
      <path
        fill="currentColor"
        d="M8.4 11.4c0-1.8 1.6-3.2 3.6-3.2s3.6 1.4 3.6 3.2v1.2c1.2.8 1.9 2 1.9 3.3 0 2.3-2.4 4.1-5.5 4.1S6.5 18.2 6.5 15.9c0-1.3.7-2.5 1.9-3.3v-1.2z"
      />
      <path
        fill="currentColor"
        d="M7.2 13.4c-1.1.8-1.7 1.9-1.7 3.1M16.8 13.4c1.1.8 1.7 1.9 1.7 3.1"
        opacity="0.55"
      />
      <path fill="currentColor" d="M10.4 19.2v1.4h3.2v-1.4H10.4z" opacity="0.75" />
    </svg>
  );
}

function OtherIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        fill="currentColor"
        d="M12 3.2 14.4 8.2l5.4.8-3.9 3.8.9 5.4L12 15.2 7.2 18.2l.9-5.4-3.9-3.8 5.4-.8L12 3.2z"
      />
      <circle cx="12" cy="12" r="3.2" fill="currentColor" opacity="0.22" />
      <path fill="currentColor" d="M12 9.4v5.2M9.4 12h5.2" opacity="0.55" />
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
      className={`inline-flex items-center justify-center text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.28)] ${sizeClasses[size]} ${className}`}
    >
      <Icon className="h-[82%] w-[82%]" aria-hidden />
    </span>
  );
}
