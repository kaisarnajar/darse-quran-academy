/** Shared password for all demo teacher accounts (local / QA only). */
export const DEMO_TEACHER_PASSWORD = "Teacher@2026";

export type Teacher = {
  id: string;
  name: string;
  email: string;
  specialization: string;
  bio: string;
  initials: string;
};

export const teachers: Teacher[] = [
  {
    id: "1",
    name: "Moulana Ibrahim Khan",
    email: "ibrahim.khan@teachers.darsequranacademy.org",
    specialization: "Quran & Tajweed",
    bio: "Qualified instructor with 15 years of teaching experience in Quran recitation and Tajweed.",
    initials: "IK",
  },
  {
    id: "2",
    name: "Moulana Yusuf Ahmed",
    email: "yusuf.ahmed@teachers.darsequranacademy.org",
    specialization: "Hifz & Qiraat",
    bio: "Certified Hifz supervisor who has guided over 200 students through complete Quran memorization.",
    initials: "YA",
  },
  {
    id: "3",
    name: "Moulana Farid Hassan",
    email: "farid.hassan@teachers.darsequranacademy.org",
    specialization: "Arabic & Nahw",
    bio: "Specializes in classical Arabic grammar and teaches advanced Nahw and Sarf to senior students.",
    initials: "FH",
  },
  {
    id: "4",
    name: "Moulana Abdul Rahman",
    email: "abdul.rahman@teachers.darsequranacademy.org",
    specialization: "Fiqh & Islamic Studies",
    bio: "Experienced in Islamic law and daily practice, with clear guidance for students around the world.",
    initials: "AR",
  },
  {
    id: "5",
    name: "Ustadha Fatima Siddiqui",
    email: "fatima.siddiqui@teachers.darsequranacademy.org",
    specialization: "Women's Quran Classes",
    bio: "Dedicated instructor for sisters-only classes, covering Nazira, Tajweed, and basic Islamic etiquette.",
    initials: "FS",
  },
  {
    id: "6",
    name: "Moulana Hamza Malik",
    email: "hamza.malik@teachers.darsequranacademy.org",
    specialization: "Seerah & Youth Programs",
    bio: "Engaging educator who leads youth circles and Seerah study groups for ages 10–18.",
    initials: "HM",
  },
];
