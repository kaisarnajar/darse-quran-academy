export type CourseCategoryIconKey =
  | "tajweed"
  | "seerah"
  | "arabic"
  | "hifz"
  | "quran"
  | "fiqh"
  | "islamic"
  | "tafsir"
  | "aqeedah"
  | "hadith"
  | "duas"
  | "other";

export type FlaticonCourseIcon = {
  key: CourseCategoryIconKey;
  label: string;
  src: string;
  iconId: number;
  slug: string;
  author: string;
  authorUrl: string;
};

const FLATICON_AUTHOR_BASE = "https://www.flaticon.com/authors";

export const FLATICON_COURSE_ICONS: Record<CourseCategoryIconKey, FlaticonCourseIcon> = {
  quran: {
    key: "quran",
    label: "Quran",
    src: "/icons/flaticon/course-categories/quran.png",
    iconId: 1717548,
    slug: "quran",
    author: "Freepik",
    authorUrl: `${FLATICON_AUTHOR_BASE}/freepik`,
  },
  tajweed: {
    key: "tajweed",
    label: "Tajweed",
    src: "/icons/flaticon/course-categories/quran-tajweed.png",
    iconId: 18947682,
    slug: "quran",
    author: "Magnific",
    authorUrl: "https://www.flaticon.com/",
  },
  hifz: {
    key: "hifz",
    label: "Hifz",
    src: "/icons/flaticon/course-categories/tasbih.png",
    iconId: 19038297,
    slug: "tasbih",
    author: "Magnific",
    authorUrl: "https://www.flaticon.com/",
  },
  seerah: {
    key: "seerah",
    label: "Seerah",
    src: "/icons/flaticon/course-categories/prophets-mosque.png",
    iconId: 4269431,
    slug: "the-prophets-mosque",
    author: "Freepik",
    authorUrl: `${FLATICON_AUTHOR_BASE}/freepik`,
  },
  arabic: {
    key: "arabic",
    label: "Arabic",
    src: "/icons/flaticon/course-categories/koran.png",
    iconId: 1183438,
    slug: "koran",
    author: "Freepik",
    authorUrl: `${FLATICON_AUTHOR_BASE}/freepik`,
  },
  fiqh: {
    key: "fiqh",
    label: "Fiqh",
    src: "/icons/flaticon/course-categories/scales.png",
    iconId: 1430,
    slug: "scales-of-justice",
    author: "Freepik",
    authorUrl: `${FLATICON_AUTHOR_BASE}/freepik`,
  },
  islamic: {
    key: "islamic",
    label: "Islamic Studies",
    src: "/icons/flaticon/course-categories/kaaba.png",
    iconId: 19038391,
    slug: "kaaba",
    author: "Magnific",
    authorUrl: "https://www.flaticon.com/",
  },
  tafsir: {
    key: "tafsir",
    label: "Tafsir",
    src: "/icons/flaticon/course-categories/tafsir-book.png",
    iconId: 17259757,
    slug: "holy-book",
    author: "Magnific",
    authorUrl: "https://www.flaticon.com/",
  },
  aqeedah: {
    key: "aqeedah",
    label: "Aqeedah",
    src: "/icons/flaticon/course-categories/crescent.png",
    iconId: 7515485,
    slug: "crescent",
    author: "Freepik",
    authorUrl: `${FLATICON_AUTHOR_BASE}/freepik`,
  },
  hadith: {
    key: "hadith",
    label: "Hadith",
    src: "/icons/flaticon/course-categories/hadist.png",
    iconId: 15993562,
    slug: "hadist",
    author: "Freepik",
    authorUrl: `${FLATICON_AUTHOR_BASE}/freepik`,
  },
  duas: {
    key: "duas",
    label: "Duas & Adhkar",
    src: "/icons/flaticon/course-categories/praying-hands.png",
    iconId: 14900725,
    slug: "praying-hands",
    author: "Freepik",
    authorUrl: `${FLATICON_AUTHOR_BASE}/freepik`,
  },
  other: {
    key: "other",
    label: "Other",
    src: "/icons/flaticon/course-categories/mosque.png",
    iconId: 10324895,
    slug: "mosque",
    author: "Freepik",
    authorUrl: `${FLATICON_AUTHOR_BASE}/freepik`,
  },
};

export function getCourseCategoryIconKey(category: string): CourseCategoryIconKey {
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

export function getFlaticonCourseIcon(category: string): FlaticonCourseIcon {
  const key = getCourseCategoryIconKey(category);
  return FLATICON_COURSE_ICONS[key];
}

export type FlaticonAttribution = {
  author: string;
  authorUrl: string;
};

/** Unique authors for footer attribution (Flaticon free license). */
export function getFlaticonCourseIconAttributions(): FlaticonAttribution[] {
  const seen = new Set<string>();
  const attributions: FlaticonAttribution[] = [];

  for (const icon of Object.values(FLATICON_COURSE_ICONS)) {
    if (seen.has(icon.author)) continue;
    seen.add(icon.author);
    attributions.push({ author: icon.author, authorUrl: icon.authorUrl });
  }

  return attributions.sort((a, b) => a.author.localeCompare(b.author));
}
