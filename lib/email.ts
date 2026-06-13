import nodemailer from "nodemailer";

export type EmailSendResult = {
  sent: boolean;
  skipped?: boolean;
  error?: string;
};

export function isEmailConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function stripEnvQuotes(value: string): string {
  return value.replace(/^["']|["']$/g, "");
}

function getSmtpPassword(): string {
  // Gmail app passwords are often copied with spaces — remove them.
  return (process.env.SMTP_PASS ?? "").replace(/\s/g, "");
}

function getFromAddress(): string {
  const raw =
    process.env.EMAIL_FROM?.trim() ||
    process.env.SMTP_USER?.trim() ||
    "noreply@darsequranacademy.org";
  return stripEnvQuotes(raw);
}

function createTransport() {
  const port = Number(process.env.SMTP_PORT || 587);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST?.trim(),
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER?.trim(),
      pass: getSmtpPassword(),
    },
    connectionTimeout: 20_000,
    greetingTimeout: 20_000,
  });
}

type DeliverMailParams = {
  to: string;
  subject: string;
  text: string;
  html: string;
  preview?: string;
};

async function deliverMail({
  to,
  subject,
  text,
  html,
  preview,
}: DeliverMailParams): Promise<EmailSendResult> {
  if (!isEmailConfigured()) {
    console.info("[email] SMTP not configured. Email would be sent to:", to);
    console.info("[email] Subject:", subject);
    if (preview) {
      console.info("[email] Preview:", preview);
    }
    return { sent: false, skipped: true };
  }

  try {
    const transport = createTransport();
    await transport.sendMail({
      from: getFromAddress(),
      to,
      subject,
      text,
      html,
    });
    return { sent: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send email.";
    console.error("[email] Failed to send email to:", to, message);
    return { sent: false, error: message };
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export type FatwaAnswerEmailParams = {
  to: string;
  askerName: string;
  questionTitle: string;
  fatwaUrl: string;
};

export type PaymentDeclinedEmailParams = {
  to: string;
  studentName: string;
  courseTitle: string;
  paymentUrl: string;
};

export async function sendPaymentDeclinedEmail(params: PaymentDeclinedEmailParams): Promise<EmailSendResult> {
  const { to, studentName, courseTitle, paymentUrl } = params;
  const displayName = studentName || "Student";

  const subject = `Action required: resubmit payment — ${courseTitle}`;
  const text = [
    `Assalamu Alaikum ${displayName},`,
    "",
    `We could not verify your registration payment for "${courseTitle}" at Darse Quran Academy.`,
    "",
    "Please submit your payment details again (UPI reference or bank transfer proof) using the link below:",
    paymentUrl,
    "",
    "Once we verify your payment, your enrollment will be activated.",
    "",
    "If you believe this was a mistake, please reply to this email or contact the academy.",
    "",
    "Darse Quran Academy",
  ].join("\n");

  const html = [
    '<div style="font-family: system-ui, sans-serif; line-height: 1.6; color: #1c1917; max-width: 560px;">',
    `<p>Assalamu Alaikum <strong>${escapeHtml(displayName)}</strong>,</p>`,
    `<p>We could not verify your registration payment for <strong>${escapeHtml(courseTitle)}</strong> at Darse Quran Academy.</p>`,
    "<p>Please submit your payment details again (UPI reference or bank transfer proof):</p>",
    '<p style="margin: 28px 0;">',
    `<a href="${paymentUrl}" style="background: #3730a3; color: #fff; padding: 12px 24px; border-radius: 9999px; text-decoration: none; font-weight: 600;">`,
    "Resubmit payment",
    "</a></p>",
    `<p style="font-size: 14px; color: #57534e;">Or copy this link: <a href="${paymentUrl}">${escapeHtml(paymentUrl)}</a></p>`,
    "<p>Once we verify your payment, your enrollment will be activated.</p>",
    '<p style="margin-top: 24px; font-size: 14px; color: #57534e;">— Darse Quran Academy</p>',
    "</div>",
  ].join("");

  return deliverMail({
    to,
    subject,
    text,
    html,
    preview: paymentUrl,
  });
}

export type PasswordResetEmailParams = {
  to: string;
  resetUrl: string;
};

export async function sendPasswordResetEmail(params: PasswordResetEmailParams): Promise<EmailSendResult> {
  const { to, resetUrl } = params;

  const subject = "Reset your password — Darse Quran Academy";
  const text = [
    "Assalamu Alaikum,",
    "",
    "We received a request to reset the password for your Darse Quran Academy account.",
    "",
    "Use the link below to choose a new password. This link expires in one hour.",
    resetUrl,
    "",
    "If you did not request this, you can ignore this email.",
    "",
    "Darse Quran Academy",
  ].join("\n");

  const html = [
    '<div style="font-family: system-ui, sans-serif; line-height: 1.6; color: #1c1917; max-width: 560px;">',
    "<p>Assalamu Alaikum,</p>",
    "<p>We received a request to reset the password for your Darse Quran Academy account.</p>",
    "<p>Click the button below to choose a new password. This link expires in one hour.</p>",
    '<p style="margin: 28px 0;">',
    `<a href="${resetUrl}" style="background: #3730a3; color: #fff; padding: 12px 24px; border-radius: 9999px; text-decoration: none; font-weight: 600;">`,
    "Reset password",
    "</a></p>",
    `<p style="font-size: 14px; color: #57534e;">Or copy this link: <a href="${resetUrl}">${escapeHtml(resetUrl)}</a></p>`,
    "<p>If you did not request this, you can ignore this email.</p>",
    '<p style="margin-top: 24px; font-size: 14px; color: #57534e;">— Darse Quran Academy</p>',
    "</div>",
  ].join("");

  return deliverMail({
    to,
    subject,
    text,
    html,
    preview: resetUrl,
  });
}

export async function sendFatwaAnswerEmail(params: FatwaAnswerEmailParams): Promise<EmailSendResult> {
  const { to, askerName, questionTitle, fatwaUrl } = params;
  const displayName = askerName || "Reader";

  const subject = `Your question has been answered — ${questionTitle}`;
  const text = [
    `Assalamu Alaikum ${displayName},`,
    "",
    `Your question "${questionTitle}" has been answered on Darse Quran Academy.`,
    "",
    "Read the answer here:",
    fatwaUrl,
    "",
    "Darse Quran Academy — Fatwa Section",
  ].join("\n");

  const html = [
    '<div style="font-family: system-ui, sans-serif; line-height: 1.6; color: #1c1917; max-width: 560px;">',
    `<p>Assalamu Alaikum <strong>${escapeHtml(displayName)}</strong>,</p>`,
    `<p>Your question <strong>${escapeHtml(questionTitle)}</strong> has been answered.</p>`,
    '<p style="margin: 28px 0;">',
    `<a href="${fatwaUrl}" style="background: #3730a3; color: #fff; padding: 12px 24px; border-radius: 9999px; text-decoration: none; font-weight: 600;">`,
    "Read the answer",
    "</a></p>",
    `<p style="font-size: 14px; color: #57534e;">Or copy this link: <a href="${fatwaUrl}">${escapeHtml(fatwaUrl)}</a></p>`,
    '<p style="margin-top: 24px; font-size: 14px; color: #57534e;">— Darse Quran Academy</p>',
    "</div>",
  ].join("");

  return deliverMail({
    to,
    subject,
    text,
    html,
    preview: fatwaUrl,
  });
}

export type ContactInquiryReplyEmailParams = {
  to: string;
  name: string;
  originalMessage: string;
  reply: string;
};

export async function sendContactInquiryReplyEmail(
  params: ContactInquiryReplyEmailParams,
): Promise<EmailSendResult> {
  const { to, name, originalMessage, reply } = params;
  const displayName = name || "Reader";

  const subject = "Reply from Darse Quran Academy";
  const text = [
    `Assalamu Alaikum ${displayName},`,
    "",
    "Thank you for contacting Darse Quran Academy. Here is our reply to your message:",
    "",
    reply,
    "",
    "— Your original message —",
    originalMessage,
    "",
    "Darse Quran Academy",
  ].join("\n");

  const html = [
    '<div style="font-family: system-ui, sans-serif; line-height: 1.6; color: #1c1917; max-width: 560px;">',
    `<p>Assalamu Alaikum <strong>${escapeHtml(displayName)}</strong>,</p>`,
    "<p>Thank you for contacting Darse Quran Academy. Here is our reply to your message:</p>",
    `<div style="margin: 20px 0; padding: 16px; border-left: 4px solid #d4a017; background: #fef9e7; white-space: pre-wrap;">${escapeHtml(reply)}</div>`,
    '<p style="font-size: 14px; color: #57534e; margin-top: 24px;">Your original message:</p>',
    `<div style="font-size: 14px; color: #57534e; white-space: pre-wrap;">${escapeHtml(originalMessage)}</div>`,
    '<p style="margin-top: 24px; font-size: 14px; color: #57534e;">— Darse Quran Academy</p>',
    "</div>",
  ].join("");

  return deliverMail({
    to,
    subject,
    text,
    html,
    preview: reply,
  });
}
