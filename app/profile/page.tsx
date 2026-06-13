import Link from "next/link";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { requireUser } from "@/lib/auth-actions";
import {
  formatDateOfBirthForInput,
  isProfileComplete,
  userProfileSelect,
} from "@/lib/profile";
import { prisma } from "@/lib/prisma";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ complete?: string }>;
}) {
  const session = await requireUser();
  const { complete } = await searchParams;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { ...userProfileSelect, createdAt: true },
  });

  if (!user) {
    return null;
  }

  const profileComplete = isProfileComplete(user);

  return (
    <div className="space-y-6">
      {!profileComplete && (
        <div
          className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
          role="status"
        >
          <p className="font-medium">Complete your profile to enroll in courses</p>
          <p className="mt-1 text-amber-900/90">
            The academy needs your full details for course registration. Fill in all fields below,
            then return to the course page to request enrollment.
          </p>
        </div>
      )}
      {complete === "1" && profileComplete && (
        <div
          className="rounded-lg border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-900"
          role="status"
        >
          <p className="font-medium">Your profile is complete</p>
          <p className="mt-1">You can browse courses and request enrollment. Any enrollment or monthly fees are shown on each course.</p>
          <Link href="/courses" className="mt-2 inline-block font-medium text-primary hover:underline">
            Browse courses →
          </Link>
        </div>
      )}

      <p className="text-sm text-muted">
        Member since{" "}
        {user.createdAt.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>

      <ProfileForm
        name={user.name}
        email={user.email}
        fatherName={user.fatherName}
        dateOfBirth={formatDateOfBirthForInput(user.dateOfBirth)}
        occupation={user.occupation}
        address={user.address}
        whatsapp={user.whatsapp}
      />
    </div>
  );
}
