import { getAdminEmails } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function getStudentUsers() {
  const adminEmails = getAdminEmails();

  return prisma.user.findMany({
    where: adminEmails.length > 0 ? { email: { notIn: adminEmails } } : undefined,
    orderBy: { createdAt: "desc" },
  });
}

export async function getStudentUserById(id: string) {
  const adminEmails = getAdminEmails();

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      enrollments: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) return null;
  if (adminEmails.includes(user.email.toLowerCase())) return null;

  return user;
}

export async function getStudentCount() {
  const adminEmails = getAdminEmails();

  return prisma.user.count({
    where: adminEmails.length > 0 ? { email: { notIn: adminEmails } } : undefined,
  });
}
