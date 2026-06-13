export type Course = {
  id: string;
  title: string;
  description: string;
  startDate: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  /** Legacy DB field; UPI registration fee is derived from level in lib/course-pricing.ts */
  priceInrPaise: number;
  teacherId: string;
};

export const courses: Course[] = [
  {
    id: "quran-nazira",
    title: "Quran Nazira (Reading)",
    description:
      "Learn to read the Holy Quran with correct pronunciation and fluency. Suitable for all ages.",
    startDate: "June 2026",
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
    startDate: "July 2026",
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
    startDate: "May 2026",
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
    startDate: "August 2026",
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
    startDate: "June 2026",
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
    priceInrPaise: 9900,
    teacherId: "6",
  },
];
