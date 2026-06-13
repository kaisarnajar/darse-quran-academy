import {
  formatFormDate,
  hasPartialFormDate,
  type FormDateParts,
} from "@/lib/form-date";
import { zodResultToFormValidation, type FormValidationResult } from "@/lib/form-validation";
import {
  blogPostSchema,
  courseSchema,
  dailyInspirationSchema,
  libraryItemSchema,
  paymentSettingsSchema,
  siteAnnouncementSchema,
  socialLinksSettingsSchema,
  teacherAdminSchema,
  teacherBlogPostSchema,
} from "@/lib/validations";

export type SiteAnnouncementFormValues = {
  title: string;
  body: string;
  location: string;
  eventDay: string;
  eventMonth: string;
  eventYear: string;
  showOnHomepage: boolean;
  published: boolean;
};

export function validateSiteAnnouncementForm(values: SiteAnnouncementFormValues): FormValidationResult {
  const eventDateParts: FormDateParts = {
    day: values.eventDay,
    month: values.eventMonth,
    year: values.eventYear,
  };
  const eventDate = formatFormDate(values.eventDay, values.eventMonth, values.eventYear) ?? "";

  if (hasPartialFormDate(eventDateParts) && !eventDate) {
    return {
      success: false,
      issues: [
        {
          path: ["eventDate"],
          message: "Select a complete event date or leave all date fields blank.",
        },
      ],
    };
  }

  if (values.showOnHomepage && !values.published) {
    return {
      success: false,
      issues: [
        {
          path: ["showOnHomepage"],
          message: "Only published announcements can appear on the homepage.",
        },
      ],
    };
  }

  return zodResultToFormValidation(
    siteAnnouncementSchema.safeParse({
      title: values.title,
      body: values.body,
      eventDate,
      location: values.location,
      showOnHomepage: values.showOnHomepage,
      published: values.published,
    }),
  );
}

export type CourseFormValues = {
  title: string;
  description: string;
  startDay: string;
  startMonth: string;
  startYear: string;
  category: string;
  teacherId: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  enrollmentFeeInr: string;
  monthlyFeeInr: string;
  status: string;
};

export function validateCourseForm(values: CourseFormValues): FormValidationResult {
  const startDateParts: FormDateParts = {
    day: values.startDay,
    month: values.startMonth,
    year: values.startYear,
  };
  const startDate = formatFormDate(values.startDay, values.startMonth, values.startYear) ?? "";

  if (hasPartialFormDate(startDateParts) && !startDate) {
    return {
      success: false,
      issues: [{ path: ["startDate"], message: "Start date is required." }],
    };
  }

  return zodResultToFormValidation(
    courseSchema.safeParse({
      title: values.title,
      description: values.description,
      startDate,
      level: values.level,
      category: values.category,
      enrollmentFeeInr: values.enrollmentFeeInr,
      monthlyFeeInr: values.monthlyFeeInr,
      teacherId: values.teacherId,
      status: values.status,
    }),
  );
}

export type TeacherFormValues = {
  email: string;
  specialization: string;
  bio: string;
  initials: string;
  imageUrl: string;
  published: boolean;
};

export function validateTeacherForm(values: TeacherFormValues): FormValidationResult {
  return zodResultToFormValidation(
    teacherAdminSchema.safeParse({
      email: values.email,
      specialization: values.specialization,
      bio: values.bio,
      initials: values.initials,
      imageUrl: values.imageUrl,
      published: values.published,
    }),
  );
}

export type BlogPostFormValues = {
  title: string;
  excerpt: string;
  body: string;
  published: boolean;
};

export function validateBlogPostForm(values: BlogPostFormValues, mode: "admin" | "teacher"): FormValidationResult {
  const schema = mode === "teacher" ? teacherBlogPostSchema : blogPostSchema;
  return zodResultToFormValidation(
    schema.safeParse({
      title: values.title,
      excerpt: values.excerpt,
      body: values.body,
      ...(mode === "admin" ? { published: values.published } : {}),
    }),
  );
}

export type DailyInspirationFormValues = {
  kind: "QURAN" | "HADITH";
  arabicText: string;
  englishTranslation: string;
  reference: string;
  published: boolean;
};

export function validateDailyInspirationForm(values: DailyInspirationFormValues): FormValidationResult {
  return zodResultToFormValidation(
    dailyInspirationSchema.safeParse({
      kind: values.kind,
      arabicText: values.arabicText,
      englishTranslation: values.englishTranslation,
      reference: values.reference,
      published: values.published,
    }),
  );
}

export type LibraryFormValues = {
  title: string;
  author: string;
  topic: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  language: string;
  pdfUrl: string;
  published: boolean;
};

export function validateLibraryForm(values: LibraryFormValues): FormValidationResult {
  return zodResultToFormValidation(
    libraryItemSchema.safeParse({
      title: values.title,
      author: values.author,
      topic: values.topic,
      level: values.level,
      language: values.language,
      pdfUrl: values.pdfUrl,
      published: values.published,
    }),
  );
}

export type PaymentSettingsFormValues = {
  upiId: string;
  upiPayeeName: string;
  bankAccountName: string;
  bankName: string;
  bankAccountNumber: string;
  bankIfsc: string;
  bankBranch: string;
};

export function validatePaymentSettingsForm(values: PaymentSettingsFormValues): FormValidationResult {
  return zodResultToFormValidation(paymentSettingsSchema.safeParse(values));
}

export type SocialLinksFormValues = {
  contactEmail: string;
  whatsappNumber: string;
  whatsappDefaultMessage: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
};

export function validateSocialLinksForm(values: SocialLinksFormValues): FormValidationResult {
  return zodResultToFormValidation(socialLinksSettingsSchema.safeParse(values));
}
