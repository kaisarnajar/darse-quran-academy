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
