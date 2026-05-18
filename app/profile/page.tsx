import { ProfileForm } from "@/components/profile/ProfileForm";
import { requireUser } from "@/lib/auth-actions";
import { prisma } from "@/lib/prisma";

export default async function ProfilePage() {
  const session = await requireUser();

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, createdAt: true },
  });

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted">
        Member since{" "}
        {user.createdAt.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>
      <ProfileForm name={user.name} email={user.email} />
    </div>
  );
}
