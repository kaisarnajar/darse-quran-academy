import { isAdminEmail } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export function normalizeTeacherEmail(email: string): string {
  return email.toLowerCase().trim();
}

export function deriveTeacherInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "??";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0]![0]}${parts[parts.length - 1]![0]}`.toUpperCase();
}

export type TeacherAccountLookup =
  | { ok: true; name: string; email: string }
  | { ok: false; error: string };

/** Admin may only link emails that already belong to a registered user account. */
export async function lookupTeacherAccount(
  email: string,
  options?: { excludeTeacherId?: string },
): Promise<TeacherAccountLookup> {
  const normalized = normalizeTeacherEmail(email);

  if (!normalized) {
    return { ok: false, error: "Enter an email address." };
  }

  if (isAdminEmail(normalized)) {
    return { ok: false, error: "This email is reserved for administration." };
  }

  const existingTeacher = await prisma.teacher.findUnique({ where: { email: normalized } });
  if (existingTeacher && existingTeacher.id !== options?.excludeTeacherId) {
    return { ok: false, error: "This email is already linked to another teacher profile." };
  }

  const user = await prisma.user.findUnique({ where: { email: normalized } });
  if (!user) {
    return {
      ok: false,
      error:
        "No account found with this email. The person must register on the site first, then you can add them as a teacher.",
    };
  }

  const displayName = user.name?.trim() || normalized.split("@")[0] || "Teacher";

  return { ok: true, name: displayName, email: normalized };
}
