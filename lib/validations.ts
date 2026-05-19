import { z } from "zod";
import { isPaymentYearAllowed } from "@/lib/monthly-payments";
import { OCCUPATION_VALUES } from "@/lib/occupations";

export const levelEnum = z.enum(["Beginner", "Intermediate", "Advanced"]);

export const courseStatusEnum = z.enum([
  "DRAFT",
  "PUBLISHED",
  "ONGOING",
  "COMPLETED",
  "ON_HOLD",
]);

export const courseSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(10, "Description is required"),
  startDate: z.string().min(1, "Start date is required"),
  level: levelEnum,
  category: z.string().min(1, "Category is required"),
  priceInrPaise: z.coerce.number().int().min(0),
  teacherId: z.string().min(1, "Teacher is required"),
  status: courseStatusEnum,
});

/** Admin teacher profile fields (name comes from the linked user account). */
export const teacherAdminSchema = z.object({
  email: z.string().trim().email("Enter the teacher's registered account email."),
  specialization: z.string().min(2, "Specialization is required"),
  bio: z.string().min(10, "Bio is required"),
  initials: z
    .string()
    .trim()
    .max(4, "Max 4 characters")
    .optional()
    .or(z.literal("")),
  imageUrl: z.string().url().optional().or(z.literal("")),
  published: z.coerce.boolean(),
});

export const libraryItemSchema = z.object({
  title: z.string().min(2, "Title is required"),
  author: z.string().min(2, "Author is required"),
  topic: z.string().min(2, "Topic is required"),
  level: levelEnum,
  language: z.string().min(2, "Language is required"),
  pdfUrl: z.string().url().optional().or(z.literal("")),
  published: z.coerce.boolean(),
});

export const fatwaCategoryEnum = z.enum(["Islam", "Atheism", "Fatwa", "Other"]);

export const fatwaQuestionSchema = z.object({
  category: fatwaCategoryEnum,
  title: z.string().trim().min(10, "Title must be at least 10 characters.").max(200),
  question: z.string().trim().min(30, "Question must be at least 30 characters.").max(5000),
  askerName: z.string().trim().min(2, "Name is required.").max(100),
  askerEmail: z.string().trim().email("Enter a valid email address."),
});

export const fatwaAnswerSchema = z.object({
  answer: z.string().trim().min(20, "Answer must be at least 20 characters.").max(10000),
});

export const adminEnrollUserSchema = z.object({
  email: z.string().trim().email("Enter a valid student email."),
  courseId: z.string().min(1, "Select a course."),
  approveImmediately: z.coerce.boolean().optional(),
});

export const monthlyPaymentSubmitSchema = z.object({
  courseId: z.string().min(1),
  paymentMonth: z.string().regex(/^(0[1-9]|1[0-2])$/, "Select a valid month."),
  paymentYear: z
    .string()
    .regex(/^\d{4}$/, "Enter a valid year.")
    .refine(isPaymentYearAllowed, { message: "Select a fee year from the list." }),
  paymentMethod: z.enum(["upi", "bank"]),
  upiTransactionId: z
    .string()
    .trim()
    .min(8, "Enter a valid transaction / UTR reference (at least 8 characters).")
    .max(50)
    .regex(/^[a-zA-Z0-9]+$/, "Reference should contain only letters and numbers."),
});

export const occupationEnum = z.enum(OCCUPATION_VALUES);

export const profileUpdateSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters.").max(100),
  fatherName: z.string().trim().min(2, "Father's name must be at least 2 characters.").max(100),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required.")
    .refine((value) => !Number.isNaN(Date.parse(value)), "Enter a valid date of birth.")
    .refine((value) => {
      const dob = new Date(value);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      return dob <= today;
    }, "Date of birth cannot be in the future.")
    .refine((value) => {
      const dob = new Date(value);
      const minAge = new Date();
      minAge.setFullYear(minAge.getFullYear() - 5);
      return dob <= minAge;
    }, "Enter a valid date of birth."),
  occupation: occupationEnum,
  address: z.string().trim().min(10, "Address must be at least 10 characters.").max(500),
  whatsapp: z
    .string()
    .trim()
    .min(10, "WhatsApp number must be at least 10 digits.")
    .max(15, "WhatsApp number is too long.")
    .regex(/^\+?[\d\s-]+$/, "Enter a valid WhatsApp number."),
});

export const announcementCategoryEnum = z.enum([
  "EXAMS_TESTS",
  "ASSIGNMENTS_HOMEWORK",
  "STUDY_MATERIALS",
  "CLASS_SCHEDULE",
  "COURSE_ANNOUNCEMENT",
  "GENERAL_NOTICE",
]);

export const blogPostSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters.").max(200),
  excerpt: z.string().trim().max(400).optional().or(z.literal("")),
  body: z.string().trim().min(20, "Blog content must be at least 20 characters.").max(50000),
  published: z.coerce.boolean(),
});

export const teacherBlogPostSchema = blogPostSchema.omit({ published: true });

export const studentReviewSchema = z.object({
  quote: z
    .string()
    .trim()
    .min(20, "Your review must be at least 20 characters.")
    .max(1000, "Review must be at most 1000 characters."),
  course: z.string().trim().max(120).optional().or(z.literal("")),
  location: z.string().trim().max(120).optional().or(z.literal("")),
});

export const dailyInspirationKindEnum = z.enum(["QURAN", "HADITH"]);

export const dailyInspirationSchema = z.object({
  kind: dailyInspirationKindEnum,
  arabicText: z.string().trim().min(1, "Arabic text is required.").max(5000),
  englishTranslation: z
    .string()
    .trim()
    .min(1, "English translation is required.")
    .max(5000),
  reference: z.string().trim().max(300).optional().or(z.literal("")),
  published: z.coerce.boolean(),
});

export const siteAnnouncementSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters.").max(200),
  body: z.string().trim().min(10, "Message must be at least 10 characters.").max(10000),
  eventDate: z.string().trim().max(120).optional().or(z.literal("")),
  location: z.string().trim().max(200).optional().or(z.literal("")),
  showOnHomepage: z.boolean(),
  published: z.boolean(),
});

export const courseAnnouncementSchema = z.object({
  category: announcementCategoryEnum,
  title: z.string().trim().min(3, "Title must be at least 3 characters.").max(200),
  body: z.string().trim().min(10, "Message must be at least 10 characters.").max(10000),
});

export const paymentRecordSchema = z.object({
  courseId: z.string().optional(),
  amountInr: z.coerce.number().positive("Amount must be greater than zero."),
  paidAt: z.string().min(1, "Payment date is required."),
  description: z.string().trim().max(500).optional(),
});

export type CourseInput = z.infer<typeof courseSchema>;
export type TeacherAdminInput = z.infer<typeof teacherAdminSchema>;
export type LibraryItemInput = z.infer<typeof libraryItemSchema>;
export type FatwaQuestionInput = z.infer<typeof fatwaQuestionSchema>;
