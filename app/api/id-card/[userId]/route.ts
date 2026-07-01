import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isAdminSession } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { getIdCardFilename, getIdCardDesignation } from "@/lib/id-card";
import { renderIdCardToHtml } from "@/lib/id-card-html";
import { generatePdfFromHtml } from "@/lib/pdf-generator";
import { getAcademySettings } from "@/lib/academy-settings";
import { getSocialLinksSettings, formatWhatsAppForDisplay } from "@/lib/social-links";
import fs from "fs/promises";
import path from "path";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;
  const session = await auth();

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
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const isOwner = session?.user?.id === userId;
  const isAdmin = isAdminSession(session);
  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!user.idCardGeneratedAt) {
    return NextResponse.json({ error: "ID Card not generated yet." }, { status: 400 });
  }

  if (!user.name || !user.fatherName || !user.dateOfBirth || !user.occupation || !user.address || !user.whatsapp || !user.email) {
    return NextResponse.json({ error: "Profile is not complete." }, { status: 400 });
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

  const designation = getIdCardDesignation(session?.user?.role);
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
    photoUrl: user.image || "",
    academyName: academySettings.academyName,
    website: academySettings.academyWebsite,
    logoUrl: base64Logo,
    signatureUrl: base64Signature,
  };

  const html = renderIdCardToHtml(cardData);
  const inline = new URL(request.url).searchParams.get("inline") === "1";
  try {
    const pdfBuffer = await generatePdfFromHtml(html, { format: "A4", landscape: false });
    const filename = getIdCardFilename(user.name, user.id);
    const contentDisposition = inline
      ? "inline"
      : `attachment; filename="${filename}"`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": contentDisposition,
        "Cache-Control": "private, no-cache",
      },
    });
  } catch (error: any) {
    console.error("PDF Generation Error:", error?.stack || error);
    return NextResponse.json({ error: "Failed to generate PDF", details: error?.message || String(error) }, { status: 500 });
  }
}
