import type { Session } from "next-auth";

export function isAdminEmail(email: string | null | undefined): boolean {
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  if (!adminEmail || !email) return false;
  return email.toLowerCase().trim() === adminEmail;
}

export function isAdminSession(session: Session | null): boolean {
  return session?.user?.role === "ADMIN";
}

export function getAdminEmail(): string | undefined {
  return process.env.ADMIN_EMAIL;
}
