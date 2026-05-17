import { z } from "zod";

export const levelEnum = z.enum(["Beginner", "Intermediate", "Advanced"]);

export const courseSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(10, "Description is required"),
  startDate: z.string().min(1, "Start date is required"),
  level: levelEnum,
  category: z.string().min(1, "Category is required"),
  priceInrPaise: z.coerce.number().int().min(0),
  published: z.coerce.boolean(),
});

export const teacherSchema = z.object({
  name: z.string().min(2, "Name is required"),
  specialization: z.string().min(2, "Specialization is required"),
  bio: z.string().min(10, "Bio is required"),
  initials: z.string().min(1).max(4, "Max 4 characters"),
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

export type CourseInput = z.infer<typeof courseSchema>;
export type TeacherInput = z.infer<typeof teacherSchema>;
export type LibraryItemInput = z.infer<typeof libraryItemSchema>;
