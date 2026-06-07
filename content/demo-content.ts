import type { AnnouncementCategory, BlogApprovalStatus, DailyInspirationKind } from "@prisma/client";
import type { FatwaCategory } from "@/lib/fatwa";

export type DemoSiteAnnouncement = {
  id: string;
  title: string;
  body: string;
  eventDate?: string;
  location?: string;
  published: boolean;
  showOnHomepage: boolean;
};

export type DemoBlogPost = {
  id: string;
  title: string;
  excerpt?: string;
  body: string;
  published: boolean;
  approvalStatus: BlogApprovalStatus;
  /** Teacher id from `content/teachers` — omit for admin-authored posts. */
  teacherId?: string;
};

export type DemoDailyInspiration = {
  id: string;
  kind: DailyInspirationKind;
  arabicText: string;
  englishTranslation: string;
  reference?: string;
  published: boolean;
  /** When true, entry is the one shown on the homepage (latest published `updatedAt`). */
  onHomepage?: boolean;
};

export type DemoFatwa = {
  id: string;
  askerName: string;
  askerEmail: string;
  category: FatwaCategory;
  title: string;
  question: string;
  answer?: string;
  /** Demo student id from `content/demo-students` — links question to a seeded student account. */
  studentId?: string;
};

export const demoSiteAnnouncements: DemoSiteAnnouncement[] = [
  {
    id: "seed-demo-announcement-1",
    title: "Annual Hifz Graduation Ceremony",
    body: "Join us to celebrate students who completed their Hifz this academic year. Families and guests are welcome after Maghrib.",
    eventDate: "15 Rajab 1447 / 5 January 2026",
    location: "Main campus, Srinagar",
    published: true,
    showOnHomepage: true,
  },
  {
    id: "seed-demo-announcement-2",
    title: "Visiting Scholar: Tajweed Workshop",
    body: "Moulana Farid Hassan will lead a two-day Tajweed intensive for intermediate students. Registration is open in the admin office.",
    eventDate: "22–23 Safar 1447 / 12–13 January 2026",
    location: "Online + campus lab",
    published: true,
    showOnHomepage: true,
  },
  {
    id: "seed-demo-announcement-3",
    title: "Ramadan Class Timetable Released",
    body: "Revised class timings for Ramadan are now available. Evening batches start 45 minutes after Iftar.",
    eventDate: "1 Ramadan 1447 / February 2026",
    location: "All campuses",
    published: true,
    showOnHomepage: true,
  },
  {
    id: "seed-demo-announcement-4",
    title: "New Nazira Batch — Open Enrollment",
    body: "A fresh Nazira batch for beginners starts next month. Limited seats; complete your profile before requesting enrollment.",
    eventDate: "March 2026",
    location: "Online",
    published: true,
    showOnHomepage: true,
  },
  {
    id: "seed-demo-announcement-5",
    title: "Library Maintenance Weekend",
    body: "The digital library catalogue will be offline for maintenance. Downloads already saved on your device will still work.",
    eventDate: "8 March 2026",
    location: "Online portal",
    published: true,
    showOnHomepage: false,
  },
  {
    id: "seed-demo-announcement-6",
    title: "[Draft] Summer Youth Camp (unpublished)",
    body: "Internal draft — details pending confirmation from the youth program coordinator.",
    eventDate: "June 2026",
    location: "TBD",
    published: false,
    showOnHomepage: false,
  },
];

export const demoBlogPosts: DemoBlogPost[] = [
  {
    id: "seed-demo-blog-1",
    title: "Why Consistency Matters in Quran Memorization",
    excerpt: "Small daily portions beat irregular long sessions.",
    body: "Memorization is a marathon, not a sprint. Students who revise daily retain more than those who cram before assessments. Start with a fixed portion after Fajr and protect that time.",
    published: true,
    approvalStatus: "APPROVED",
  },
  {
    id: "seed-demo-blog-2",
    title: "Approved Article — Not Yet Published",
    excerpt: "This post is approved but kept off the public blog for QA.",
    body: "Admins can approve content and choose whether it appears on the public blog page. Use this state to preview formatting before going live.",
    published: false,
    approvalStatus: "APPROVED",
  },
  {
    id: "seed-demo-blog-3",
    title: "Teacher Draft: Preparing for Your First Tajweed Class",
    excerpt: "Notes for new students joining Tajweed Level 1.",
    body: "Bring a mushaf, a notebook, and headphones if joining online. We will cover makharij al-huruf in the first two sessions.",
    published: false,
    approvalStatus: "DRAFT",
    teacherId: "1",
  },
  {
    id: "seed-demo-blog-4",
    title: "Teacher Submission: Benefits of Morning Revision",
    excerpt: "Awaiting admin approval.",
    body: "Morning revision anchors what you memorized the night before. Even ten minutes after Fajr makes a measurable difference over a term.",
    published: false,
    approvalStatus: "PENDING",
    teacherId: "2",
  },
  {
    id: "seed-demo-blog-5",
    title: "Teacher Post: Understanding Madd in Practice",
    excerpt: "Published teacher article for the public blog.",
    body: "Madd is not only a theoretical rule — listen to qualified reciters and mimic their lengthening until your ear recognizes natural durations.",
    published: true,
    approvalStatus: "APPROVED",
    teacherId: "3",
  },
  {
    id: "seed-demo-blog-6",
    title: "Teacher Post: Rejected Topic Example",
    excerpt: "This submission was rejected for QA testing.",
    body: "Admins rejected this sample so you can verify the teacher portal shows the rejected status and allows resubmission.",
    published: false,
    approvalStatus: "REJECTED",
    teacherId: "4",
  },
  {
    id: "seed-demo-blog-7",
    title: "Seerah Reflections for Teen Students",
    excerpt: "Youth program blog — live on the public page.",
    body: "Studying the Seerah helps students see prophetic patience in adversity. Our youth circle uses one incident per week for discussion and journaling.",
    published: true,
    approvalStatus: "APPROVED",
    teacherId: "6",
  },
];

export const demoDailyInspirations: DemoDailyInspiration[] = [
  {
    id: "seed-demo-inspiration-1",
    kind: "QURAN",
    arabicText: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    englishTranslation: "Indeed, with hardship comes ease.",
    reference: "Qur'an 94:6",
    published: true,
    onHomepage: true,
  },
  {
    id: "seed-demo-inspiration-2",
    kind: "HADITH",
    arabicText: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
    englishTranslation: "The best among you are those who learn the Qur'an and teach it.",
    reference: "Sahih al-Bukhari",
    published: true,
  },
  {
    id: "seed-demo-inspiration-3",
    kind: "QURAN",
    arabicText: "وَاذْكُرُوا اللَّهَ كَثِيرًا",
    englishTranslation: "And remember Allah often.",
    reference: "Qur'an 33:41",
    published: false,
  },
  {
    id: "seed-demo-inspiration-4",
    kind: "HADITH",
    arabicText: "طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ",
    englishTranslation: "Seeking knowledge is an obligation upon every Muslim.",
    reference: "Ibn Majah",
    published: false,
  },
];

export const demoFatwaQuestions: DemoFatwa[] = [
  {
    id: "seed-demo-fatwa-1",
    askerName: "Amina Khan",
    askerEmail: "demo-fatwa-pending-1@seed.local",
    category: "Fiqh",
    title: "Missing a day of fasting in Ramadan",
    question: "If I missed one fast due to illness and have not made it up yet, what should I do before next Ramadan?",
  },
  {
    id: "seed-demo-fatwa-2",
    askerName: "Demo Student 03",
    askerEmail: "demo-student-03@seed.local",
    category: "Tajweed",
    title: "Stopping rules at end of ayah",
    question: "When stopping at the end of an ayah, which rule applies if the last letter has sukoon?",
    studentId: "03",
  },
  {
    id: "seed-demo-fatwa-3",
    askerName: "Yusuf Ali",
    askerEmail: "demo-fatwa-answered-1@seed.local",
    category: "Quran",
    title: "Reading Quran without wudu",
    question: "Is it permissible to read the Quran from a mobile app without wudu?",
    answer:
      "Scholars differ on touching the mushaf without wudu. Reading from memory or a screen without physically touching written Arabic text is generally permitted, though a state of purity is recommended out of adab.",
  },
  {
    id: "seed-demo-fatwa-4",
    askerName: "Fatima Begum",
    askerEmail: "demo-fatwa-answered-2@seed.local",
    category: "Hadith",
    title: "Authenticity of a common dua",
    question: "Is the dua 'Rabbana atina fid-dunya hasanah…' established in authentic collections?",
    answer:
      "Yes. This supplication is reported in Sahih al-Bukhari and Sahih Muslim from the Prophet (peace be upon him) and is widely recited in prayer.",
  },
  {
    id: "seed-demo-fatwa-5",
    askerName: "Demo Student 07",
    askerEmail: "demo-student-07@seed.local",
    category: "Islam",
    title: "Intention before voluntary prayer",
    question: "Must I verbally state my intention for a nafl prayer, or is it enough in the heart?",
    studentId: "07",
    answer:
      "The intention for prayer is in the heart. Verbalizing the niyyah is not required by the majority of scholars, though some recommend clarity of purpose before takbir.",
  },
  {
    id: "seed-demo-fatwa-6",
    askerName: "Guest User",
    askerEmail: "guest-fatwa@example.com",
    category: "Other",
    title: "Enrollment age for children's Nazira class",
    question: "What is the minimum recommended age for the children's Nazira program?",
  },
];

/** Sample course-wide announcements for QA (admin, teacher, categories). */
export type DemoCourseAnnouncement = {
  id: string;
  courseId: string;
  teacherId?: string;
  postedByAdmin?: boolean;
  authorName: string;
  category: AnnouncementCategory;
  title: string;
  body: string;
  enrollmentId?: string;
};

export const demoCourseAnnouncements: DemoCourseAnnouncement[] = [
  {
    id: "seed-demo-course-announcement-1",
    courseId: "quran-nazira",
    postedByAdmin: true,
    authorName: "Academy Admin",
    category: "COURSE_ANNOUNCEMENT",
    title: "Welcome to Quran Nazira",
    body: "Classes begin next Monday. Please join five minutes early to test your audio.",
  },
  {
    id: "seed-demo-course-announcement-2",
    courseId: "quran-nazira",
    teacherId: "1",
    authorName: "Moulana Ibrahim Khan",
    category: "CLASS_SCHEDULE",
    title: "Thursday session moved to 7 PM",
    body: "This week's live session is rescheduled due to the campus event.",
  },
  {
    id: "seed-demo-course-announcement-3",
    courseId: "hifz-foundation",
    teacherId: "2",
    authorName: "Moulana Yusuf Ahmed",
    category: "ASSIGNMENTS_HOMEWORK",
    title: "Memorize Surah al-Mulk ayat 1–5",
    body: "Submit your recitation recording link in the next private message thread.",
  },
  {
    id: "seed-demo-course-announcement-4",
    courseId: "quran-nazira",
    teacherId: "1",
    authorName: "Moulana Ibrahim Khan",
    category: "GENERAL_NOTICE",
    title: "Private message for Bilal Ahmad",
    body: "Your Tajweed assessment is scheduled for next Tuesday. Reply if you need a different slot.",
    enrollmentId: "seed-demo-enrollment-06-quran-nazira",
  },
];
