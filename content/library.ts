export type LibraryItem = {
  id: string;
  title: string;
  author: string;
  topic: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  language: string;
};

export const libraryItems: LibraryItem[] = [
  {
    id: "1",
    title: "Noorani Qaida",
    author: "Moulana Noor Muhammad",
    topic: "Quran",
    level: "Beginner",
    language: "Urdu",
  },
  {
    id: "2",
    title: "Tajweed Rules Explained",
    author: "Sheikh Ahmad Ali",
    topic: "Tajweed",
    level: "Intermediate",
    language: "English",
  },
  {
    id: "3",
    title: "Introduction to Islamic Law",
    author: "Various Scholars",
    topic: "Fiqh",
    level: "Advanced",
    language: "Urdu",
  },
  {
    id: "4",
    title: "Stories of the Prophets",
    author: "Ibn Kathir (abridged)",
    topic: "Seerah",
    level: "Beginner",
    language: "English",
  },
  {
    id: "5",
    title: "Arabic Made Easy",
    author: "Dr. V. Abdur Rahim",
    topic: "Arabic Language",
    level: "Beginner",
    language: "English",
  },
  {
    id: "6",
    title: "Riyad us-Saliheen",
    author: "Imam An-Nawawi",
    topic: "Hadith",
    level: "Intermediate",
    language: "Other",
  },
  {
    id: "7",
    title: "Essentials of Faith and Worship",
    author: "Compiled Reader",
    topic: "Islam",
    level: "Beginner",
    language: "Urdu",
  },
  {
    id: "8",
    title: "Tafsir Ibn Kathir (Selected Surahs)",
    author: "Ibn Kathir",
    topic: "Quran",
    level: "Advanced",
    language: "Arabic",
  },
];
