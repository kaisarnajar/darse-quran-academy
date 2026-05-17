import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { formatCertificateId, generateCertificatePdf } from "@/lib/certificate";
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
    include: { user: { select: { id: true, name: true } } },
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

  const pdfBytes = await generateCertificatePdf({
    studentName: enrollment.user.name ?? "Student",
    courseTitle: course.title,
    completedAt: enrollment.completedAt!,
    certificateId: formatCertificateId(enrollmentId),
  });

  const filename = getCertificateFilename(course.title, enrollmentId);

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-cache",
    },
  });
}
