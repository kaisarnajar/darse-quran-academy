import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  formatCertificateId,
  generateCertificatePdf,
  getCertificateCourseSubject,
} from "@/lib/certificate";
import { getCertificateFilename, isEnrollmentCertificateReady } from "@/lib/completion";
import { getCourseById } from "@/lib/courses";
import { prisma } from "@/lib/prisma";
import { isAdminSession } from "@/lib/admin";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ enrollmentId: string }> },
) {
  const { enrollmentId } = await params;

  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: { user: { select: { id: true, name: true, address: true } } },
  });

  if (!enrollment) {
    return NextResponse.json({ error: "Certificate not found." }, { status: 404 });
  }

  if (!isEnrollmentCertificateReady(enrollment)) {
    return NextResponse.json({ error: "Certificate is not available yet." }, { status: 403 });
  }

  const session = await auth();
  const isOwner = session?.user?.id === enrollment.userId;
  const isAdmin = isAdminSession(session);

  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const course = await getCourseById(enrollment.courseId);
  if (!course) {
    return NextResponse.json({ error: "Course not found." }, { status: 404 });
  }

  const filename = getCertificateFilename(course.title, enrollmentId);

  if (enrollment.uploadedCertificatePath) {
    const absolutePath = path.join(
      process.cwd(),
      "public",
      enrollment.uploadedCertificatePath.replace(/^\//, ""),
    );

    try {
      const pdfBytes = await readFile(absolutePath);
      return new NextResponse(Buffer.from(pdfBytes), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Cache-Control": "private, no-cache",
        },
      });
    } catch {
      return NextResponse.json({ error: "Uploaded certificate file not found." }, { status: 404 });
    }
  }

  const pdfBytes = await generateCertificatePdf({
    studentName: enrollment.user.name ?? "Student",
    studentAddress: enrollment.user.address,
    courseTitle: course.title,
    courseSubject: getCertificateCourseSubject(course),
    completedAt: enrollment.completedAt!,
    certificateId: formatCertificateId(enrollmentId),
  });

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-cache",
    },
  });
}
