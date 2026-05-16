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
    topic: "Quran Reading",
    level: "Beginner",
    language: "Urdu / Arabic",
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
    title: "Bahar-e-Shariat (Vol. 1)",
    author: "Moulana Amjad Ali",
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
    topic: "Arabic",
    level: "Beginner",
    language: "English",
  },
  {
    id: "6",
    title: "Riyad us-Saliheen",
    author: "Imam An-Nawawi",
    topic: "Hadith",
    level: "Intermediate",
    language: "Arabic / Urdu",
  },
  {
    id: "7",
    title: "Fazail-e-Amaal",
    author: "Moulana Zakariya Kandhlawi",
    topic: "Virtues",
    level: "Beginner",
    language: "Urdu",
  },
  {
    id: "8",
    title: "Tafsir Ibn Kathir (Selected Surahs)",
    author: "Ibn Kathir",
    topic: "Tafsir",
    level: "Advanced",
    language: "Arabic",
  },
];
