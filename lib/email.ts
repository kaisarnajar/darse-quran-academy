import nodemailer from "nodemailer";

export function isEmailConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function getFromAddress(): string {
  return process.env.EMAIL_FROM?.trim() || process.env.SMTP_USER?.trim() || "noreply@darsequranacademy.org";
}

function createTransport() {
  const port = Number(process.env.SMTP_PORT || 587);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export type CertificateEmailParams = {
  to: string;
  studentName: string;
  courseTitle: string;
  certificateUrl: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendCertificateEmail(params: CertificateEmailParams): Promise<void> {
  const { to, studentName, courseTitle, certificateUrl } = params;
  const displayName = studentName || "Student";

  const subject = `Congratulations! Download your certificate — ${courseTitle}`;
  const text = [
    `Assalamu Alaikum ${displayName},`,
    "",
    `Congratulations on completing "${courseTitle}" at Darse Quran Academy!`,
    "",
    "Your certificate of completion is ready. Download it using the link below:",
    certificateUrl,
    "",
    "We pray this knowledge benefits you and those around you.",
    "",
    "Darse Quran Academy",
  ].join("\n");

  const html = [
    '<div style="font-family: system-ui, sans-serif; line-height: 1.6; color: #1c1917; max-width: 560px;">',
    `<p>Assalamu Alaikum <strong>${escapeHtml(displayName)}</strong>,</p>`,
    `<p>Congratulations on completing <strong>${escapeHtml(courseTitle)}</strong> at Darse Quran Academy!</p>`,
    "<p>Your certificate of completion is ready. Click the button below to download it:</p>",
    '<p style="margin: 28px 0;">',
    `<a href="${certificateUrl}" style="background: #3730a3; color: #fff; padding: 12px 24px; border-radius: 9999px; text-decoration: none; font-weight: 600;">`,
    "Download certificate",
    "</a></p>",
    `<p style="font-size: 14px; color: #57534e;">Or copy this link: <a href="${certificateUrl}">${escapeHtml(certificateUrl)}</a></p>`,
    "<p>We pray this knowledge benefits you and those around you.</p>",
    '<p style="margin-top: 24px; font-size: 14px; color: #57534e;">— Darse Quran Academy</p>',
    "</div>",
  ].join("");

  if (!isEmailConfigured()) {
    console.info("[email] SMTP not configured. Certificate email would be sent to:", to);
    console.info("[email] Download link:", certificateUrl);
    return;
  }

  const transport = createTransport();
  await transport.sendMail({
    from: getFromAddress(),
    to,
    subject,
    text,
    html,
  });
}

export type FatwaAnswerEmailParams = {
  to: string;
  askerName: string;
  questionTitle: string;
  fatwaUrl: string;
};

export type PaymentReceiptEmailParams = {
  to: string;
  studentName: string;
  courseTitle: string;
  description: string;
  receiptUrl: string;
};

export async function sendPaymentReceiptEmail(params: PaymentReceiptEmailParams): Promise<void> {
  const { to, studentName, courseTitle, description, receiptUrl } = params;
  const displayName = studentName || "Student";

  const subject = `Payment receipt — ${courseTitle}`;
  const text = [
    `Assalamu Alaikum ${displayName},`,
    "",
    `Your payment for "${description}" (${courseTitle}) has been approved.`,
    "",
    "Download your receipt using the link below:",
    receiptUrl,
    "",
    "Darse Quran Academy",
  ].join("\n");

  const html = [
    '<div style="font-family: system-ui, sans-serif; line-height: 1.6; color: #1c1917; max-width: 560px;">',
    `<p>Assalamu Alaikum <strong>${escapeHtml(displayName)}</strong>,</p>`,
    `<p>Your payment for <strong>${escapeHtml(description)}</strong> (${escapeHtml(courseTitle)}) has been approved.</p>`,
    "<p>Download your receipt:</p>",
    '<p style="margin: 28px 0;">',
    `<a href="${receiptUrl}" style="background: #3730a3; color: #fff; padding: 12px 24px; border-radius: 9999px; text-decoration: none; font-weight: 600;">`,
    "Download receipt",
    "</a></p>",
    `<p style="font-size: 14px; color: #57534e;">Or copy this link: <a href="${receiptUrl}">${escapeHtml(receiptUrl)}</a></p>`,
    '<p style="margin-top: 24px; font-size: 14px; color: #57534e;">— Darse Quran Academy</p>',
    "</div>",
  ].join("");

  if (!isEmailConfigured()) {
    console.info("[email] SMTP not configured. Payment receipt email would be sent to:", to);
    console.info("[email] Receipt link:", receiptUrl);
    return;
  }

  const transport = createTransport();
  await transport.sendMail({
    from: getFromAddress(),
    to,
    subject,
    text,
    html,
  });
}

export type PaymentDeclinedEmailParams = {
  to: string;
  studentName: string;
  courseTitle: string;
  paymentUrl: string;
};

export async function sendPaymentDeclinedEmail(params: PaymentDeclinedEmailParams): Promise<void> {
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

  if (!isEmailConfigured()) {
    console.info("[email] SMTP not configured. Payment declined email would be sent to:", to);
    console.info("[email] Resubmit link:", paymentUrl);
    return;
  }

  const transport = createTransport();
  await transport.sendMail({
    from: getFromAddress(),
    to,
    subject,
    text,
    html,
  });
}

export async function sendFatwaAnswerEmail(params: FatwaAnswerEmailParams): Promise<void> {
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

  if (!isEmailConfigured()) {
    console.info("[email] SMTP not configured. Fatwa answer email would be sent to:", to);
    console.info("[email] Fatwa URL:", fatwaUrl);
    return;
  }

  const transport = createTransport();
  await transport.sendMail({
    from: getFromAddress(),
    to,
    subject,
    text,
    html,
  });
}
