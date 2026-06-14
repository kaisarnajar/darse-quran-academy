export type Course = {
  id: string;
  title: string;
  description: string;
  startDate: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  /** One-time enrollment fee in paise; 0 = free enrollment (admin approval only). */
  priceInrPaise: number;
  teacherId: string;
};

export const courses: Course[] = [
  {
    id: "quran-nazira",
    title: "Quran Nazira (Reading)",
    description:
      "Learn to read the Holy Quran with correct pronunciation and fluency. Suitable for all ages.",
    startDate: "2026-06-01",
    duration: "6 months",
    level: "Beginner",
    category: "Quran",
    priceInrPaise: 9900,
    teacherId: "1",
  },
  {
    id: "hifz-foundation",
    title: "Hifz Foundation Program",
    description:
      "Structured memorization program with daily revision schedules and qualified supervisors.",
    startDate: "2026-07-01",
    duration: "1 year",
    level: "Intermediate",
    category: "Hifz",
    priceInrPaise: 19900,
    teacherId: "2",
  },
  {
    id: "tajweed-intensive",
    title: "Tajweed Intensive",
    description:
      "Master the rules of Tajweed through guided practice and individual feedback sessions.",
    startDate: "2026-05-01",
    duration: "3 months",
    level: "Advanced",
    category: "Tajweed",
    priceInrPaise: 19900,
    teacherId: "1",
  },
  {
    id: "arabic-grammar",
    title: "Arabic Grammar (Nahw & Sarf)",
    description:
      "Build a strong foundation in classical Arabic grammar for deeper understanding of Islamic texts.",
    startDate: "2026-08-01",
    duration: "8 months",
    level: "Intermediate",
    category: "Arabic",
    priceInrPaise: 19900,
    teacherId: "3",
  },
  {
    id: "fiqh-basics",
    title: "Fiqh Essentials",
    description:
      "Introduction to Islamic jurisprudence covering worship, transactions, and daily life rulings.",
    startDate: "2026-06-01",
    duration: "6 months",
    level: "Beginner",
    category: "Islamic Studies",
    priceInrPaise: 9900,
    teacherId: "4",
  },
  {
    id: "seerah-youth",
    title: "Seerah for Youth",
    description:
      "Engaging weekly sessions on the life of Prophet Muhammad (peace be upon him) for young learners.",
    startDate: "Ongoing",
    duration: "Ongoing",
    level: "Beginner",
    category: "Seerah",
    priceInrPaise: 0,
    teacherId: "6",
  },
  {
    id: "tafsir-juz-amma",
    title: "Tafsir of Juz Amma",
    description:
      "Word-by-word and thematic study of the last Juz with practical lessons for daily worship.",
    startDate: "2026-07-01",
    duration: "4 months",
    level: "Intermediate",
    category: "Tafsir",
    priceInrPaise: 19900,
    teacherId: "7",
  },
  {
    id: "quran-nazira-women",
    title: "Quran Nazira — Sisters Batch",
    description:
      "Sisters-only Nazira classes with a comfortable learning environment and qualified female instructors.",
    startDate: "2026-06-01",
    duration: "6 months",
    level: "Beginner",
    category: "Quran",
    priceInrPaise: 9900,
    teacherId: "5",
  },
  {
    id: "children-nazira",
    title: "Children's Nazira (Ages 6–12)",
    description:
      "Playful yet disciplined Nazira program for children with short sessions and parent progress updates.",
    startDate: "2026-06-01",
    duration: "9 months",
    level: "Beginner",
    category: "Quran",
    priceInrPaise: 9900,
    teacherId: "8",
  },
  {
    id: "qiraat-advanced",
    title: "Advanced Qiraat Workshop",
    description:
      "For students who have completed Tajweed — explore Hafs and Warsh with live recitation coaching.",
    startDate: "2026-09-01",
    duration: "5 months",
    level: "Advanced",
    category: "Qiraat",
    priceInrPaise: 24900,
    teacherId: "9",
  },
  {
    id: "islamic-history",
    title: "Islamic History — Khulafa to Modern Era",
    description:
      "Survey of major periods in Islamic history with focus on lessons for contemporary Muslims.",
    startDate: "2026-08-01",
    duration: "6 months",
    level: "Intermediate",
    category: "Islamic Studies",
    priceInrPaise: 14900,
    teacherId: "11",
  },
  {
    id: "maktab-foundation",
    title: "Maktab Foundation (New Muslims & Adults)",
    description:
      "Free introductory program covering Arabic letters, basic salah, and essential Islamic manners.",
    startDate: "Ongoing",
    duration: "3 months",
    level: "Beginner",
    category: "Islamic Studies",
    priceInrPaise: 0,
    teacherId: "12",
  },
  {
    id: "dua-daily-adab",
    title: "Daily Duas & Islamic Adab",
    description:
      "Memorize essential duas and learn prophetic etiquette for home, masjid, and community life.",
    startDate: "Ongoing",
    duration: "8 weeks",
    level: "Beginner",
    category: "Islamic Studies",
    priceInrPaise: 0,
    teacherId: "4",
  },
  {
    id: "sisters-tajweed",
    title: "Sisters Tajweed Circle",
    description:
      "Evening Tajweed correction circle for sisters with weekly targets and recorded revision guides.",
    startDate: "2026-07-01",
    duration: "4 months",
    level: "Intermediate",
    category: "Tajweed",
    priceInrPaise: 14900,
    teacherId: "10",
  },
];
