import { createHash, randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { normalizeAccountEmail } from "@/lib/user-account-lookup";

const RESET_TOKEN_BYTES = 32;
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

export function getAppBaseUrl(): string {
  return process.env.AUTH_URL?.trim() || "http://localhost:3000";
}

export function hashResetToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function createResetTokenValue(): string {
  return randomBytes(RESET_TOKEN_BYTES).toString("hex");
}

export function buildPasswordResetUrl(token: string): string {
  const base = getAppBaseUrl().replace(/\/$/, "");
  return `${base}/reset-password?token=${encodeURIComponent(token)}`;
}

export async function createPasswordResetToken(email: string): Promise<string | null> {
  const normalized = normalizeAccountEmail(email);
  const user = await prisma.user.findUnique({ where: { email: normalized } });

  if (!user?.password) {
    return null;
  }

  const token = createResetTokenValue();
  const tokenHash = hashResetToken(token);
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

  await prisma.passwordResetToken.deleteMany({ where: { email: normalized } });
  await prisma.passwordResetToken.create({
    data: { email: normalized, tokenHash, expiresAt },
  });

  return token;
}

export async function consumePasswordResetToken(
  token: string,
): Promise<{ ok: true; email: string } | { ok: false; error: string }> {
  const trimmed = token.trim();
  if (!trimmed) {
    return { ok: false, error: "Reset link is invalid or has expired." };
  }

  const tokenHash = hashResetToken(trimmed);
  const record = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });

  if (!record || record.expiresAt < new Date()) {
    if (record) {
      await prisma.passwordResetToken.delete({ where: { id: record.id } });
    }
    return { ok: false, error: "Reset link is invalid or has expired." };
  }

  await prisma.passwordResetToken.deleteMany({ where: { email: record.email } });

  return { ok: true, email: record.email };
}
