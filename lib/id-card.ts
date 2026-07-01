import type { Session } from "next-auth";

export type UserRole = "USER" | "ADMIN" | "TEACHER" | "DEVELOPER";

export function getIdCardDesignation(role: UserRole | undefined): string {
  if (role === "ADMIN") return "Admin";
  if (role === "TEACHER") return "Teacher";
  if (role === "DEVELOPER") return "Developer";
  return "Student";
}

export function getIdCardFilename(name: string, userId: string): string {
  const safeName = name?.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "id-card";
  return `id-card-${safeName}-${userId.slice(0, 8)}.pdf`;
}

export type IdCardData = {
  registrationNumber: string;
  name: string;
  fatherName: string;
  address: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  designation: string;
  photoUrl: string;
  academyName: string;
  website: string;
  logoUrl: string;
  signatureUrl: string;
};
