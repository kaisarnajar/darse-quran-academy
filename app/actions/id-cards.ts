"use server";

import { after } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generatePdfFromHtml } from "@/lib/pdf-generator";
import { renderIdCardToHtml } from "@/lib/id-card-html";
import { getIdCardFilename, getIdCardDesignation } from "@/lib/id-card";
import { sendIdCardEmail } from "@/lib/email";
import { getAcademySettings } from "@/lib/academy-settings";
import { getSocialLinksSettings, formatWhatsAppForDisplay } from "@/lib/social-links";
import fs from "fs/promises";
import path from "path";

export async function generateIdCard(userId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized: User must be logged in.");
  }

  if (session.user.id !== userId && session.user.role !== "ADMIN" && session.user.role !== "DEVELOPER") {
    throw new Error("Unauthorized: Only the user or admin can generate the ID card.");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      fatherName: true,
      dateOfBirth: true,
      occupation: true,
      address: true,
      whatsapp: true,
      registrationNumber: true,
      image: true,
      idCardGeneratedAt: true,
      idCardEmailSentAt: true,
    },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  if (!user.name || !user.fatherName || !user.dateOfBirth || !user.occupation || !user.address || !user.whatsapp || !user.email) {
    throw new Error("Profile is not complete. ID card generation requires a complete profile.");
  }

  if (!user.registrationNumber) {
    throw new Error("Registration number is missing. The profile must be completed first.");
  }

  if (user.idCardGeneratedAt) {
    return { success: true };
  }

  const [socialLinks, academySettings] = await Promise.all([
    getSocialLinksSettings(),
    getAcademySettings(),
  ]);

  let base64Logo = "";
  let base64Signature = "";
  try {
    const logoPath = path.join(process.cwd(), "public", "assets", "logo.png");
    const sigPath = path.join(process.cwd(), "public", "assets", "signature.png");
    const [logoBytes, sigBytes] = await Promise.all([
      fs.readFile(logoPath).catch(() => null),
      fs.readFile(sigPath).catch(() => null),
    ]);
    if (logoBytes) base64Logo = `data:image/png;base64,${logoBytes.toString("base64")}`;
    if (sigBytes) base64Signature = `data:image/png;base64,${sigBytes.toString("base64")}`;
  } catch (error) {
    console.error("[id-card] Could not load images:", error);
  }

  const photoUrl = user.image || "";
  const designation = getIdCardDesignation(session.user.role);
  const cardData = {
    registrationNumber: user.registrationNumber,
    name: user.name,
    fatherName: user.fatherName,
    address: user.address,
    email: user.email,
    phone: formatWhatsAppForDisplay(user.whatsapp) || "N/A",
    dateOfBirth: new Date(user.dateOfBirth).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
    designation,
    photoUrl: photoUrl,
    academyName: academySettings.academyName,
    website: academySettings.academyWebsite,
    logoUrl: base64Logo,
    signatureUrl: base64Signature,
  };

  const html = renderIdCardToHtml(cardData);
  const pdfBuffer = await generatePdfFromHtml(html, { format: "A4", landscape: false, startDelayMs: 3000 });
  const pdfFilename = getIdCardFilename(user.name, user.id);

  after(async () => {
    try {
      const emailResult = await sendIdCardEmail({
        to: user.email,
        studentName: user.name,
        designation,
        pdfBuffer,
        pdfFilename,
      });

      if (emailResult.sent) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            idCardGeneratedAt: new Date(),
            idCardEmailSentAt: new Date(),
          },
        });
      } else {
        console.error("[id-card-email] Failed to send email:", emailResult.error);
      }
    } catch (error) {
      console.error("[id-card-email] Unexpected error:", error);
    }
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { idCardGeneratedAt: new Date() },
  });

  return { success: true };
}
