import { getAdminEmail } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function getStudentUsers() {
  const adminEmail = getAdminEmail()?.toLowerCase();

  return prisma.user.findMany({
    where: adminEmail ? { email: { not: adminEmail } } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      enrollments: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function getStudentUserById(id: string) {
  const adminEmail = getAdminEmail()?.toLowerCase();

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      enrollments: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) return null;
  if (adminEmail && user.email.toLowerCase() === adminEmail) return null;

  return user;
}

export async function getStudentCount() {
  const adminEmail = getAdminEmail()?.toLowerCase();

  return prisma.user.count({
    where: adminEmail ? { email: { not: adminEmail } } : undefined,
  });
}
