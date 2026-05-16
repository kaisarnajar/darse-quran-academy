export type Teacher = {
  id: string;
  name: string;
  specialization: string;
  bio: string;
  initials: string;
};

export const teachers: Teacher[] = [
  {
    id: "1",
    name: "Moulana Ibrahim Khan",
    specialization: "Quran & Tajweed",
    bio: "Graduate of Darul Uloom Deoband with 15 years of teaching experience in Quran recitation and Tajweed.",
    initials: "IK",
  },
  {
    id: "2",
    name: "Moulana Yusuf Ahmed",
    specialization: "Hifz & Qiraat",
    bio: "Certified Hifz supervisor who has guided over 200 students through complete Quran memorization.",
    initials: "YA",
  },
  {
    id: "3",
    name: "Moulana Farid Hassan",
    specialization: "Arabic & Nahw",
    bio: "Specializes in classical Arabic grammar and teaches advanced Nahw and Sarf to senior students.",
    initials: "FH",
  },
  {
    id: "4",
    name: "Moulana Abdul Rahman",
    specialization: "Fiqh & Islamic Studies",
    bio: "Expert in Hanafi Fiqh with a focus on practical application for students in the West and South Asia.",
    initials: "AR",
  },
  {
    id: "5",
    name: "Ustadha Fatima Siddiqui",
    specialization: "Women's Quran Classes",
    bio: "Dedicated instructor for sisters-only classes, covering Nazira, Tajweed, and basic Islamic etiquette.",
    initials: "FS",
  },
  {
    id: "6",
    name: "Moulana Hamza Malik",
    specialization: "Seerah & Youth Programs",
    bio: "Engaging educator who leads youth circles and Seerah study groups for ages 10–18.",
    initials: "HM",
  },
];
