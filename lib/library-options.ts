export const LIBRARY_LANGUAGES = ["English", "Urdu", "Arabic", "Other"] as const;

export const LIBRARY_TOPICS = [
  "Seerah",
  "Fiqh",
  "Tajweed",
  "Quran",
  "Tafsir",
  "Hadith",
  "Aqeedah",
  "Arabic",
  "Islamic Studies",
  "Hifz",
  "Duas & Adhkar",
  "Other",
] as const;

export type LibraryLanguage = (typeof LIBRARY_LANGUAGES)[number];
export type LibraryTopic = (typeof LIBRARY_TOPICS)[number];

export const LIBRARY_LANGUAGE_OPTIONS = LIBRARY_LANGUAGES.map((language) => ({
  value: language,
  label: language,
}));

export const LIBRARY_TOPIC_OPTIONS = LIBRARY_TOPICS.map((topic) => ({
  value: topic,
  label: topic,
}));

export function isLibraryLanguage(value: string): value is LibraryLanguage {
  return (LIBRARY_LANGUAGES as readonly string[]).includes(value);
}

export function isLibraryTopic(value: string): value is LibraryTopic {
  return (LIBRARY_TOPICS as readonly string[]).includes(value);
}

export function getLibraryLanguageOptions(current?: string | null) {
  if (!current || isLibraryLanguage(current)) {
    return LIBRARY_LANGUAGE_OPTIONS;
  }

  return [{ value: current, label: current }, ...LIBRARY_LANGUAGE_OPTIONS];
}

export function getLibraryTopicOptions(current?: string | null) {
  if (!current || isLibraryTopic(current)) {
    return LIBRARY_TOPIC_OPTIONS;
  }

  return [{ value: current, label: current }, ...LIBRARY_TOPIC_OPTIONS];
}
