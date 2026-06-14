import type { Metadata } from "next";
import { ProfileNav } from "@/components/profile/ProfileNav";
import { PageHeader } from "@/components/site/PageHeader";
import { Section } from "@/components/site/Section";
import { requireUser } from "@/lib/auth-actions";
import { getUnreadNotificationCount } from "@/lib/notifications";
import { getUserProfile } from "@/lib/profile";

export const metadata: Metadata = {
  title: "My Profile",
  description: "Manage your profile, payments, and courses at Darse Quran Academy.",
};

function profileSignedInDescription(name: string | null | undefined, email: string | null | undefined) {
  const trimmedName = name?.trim();
  const trimmedEmail = email?.trim();

  if (trimmedName && trimmedEmail) {
    return `Signed in as ${trimmedName} (${trimmedEmail})`;
  }

  if (trimmedName) {
    return `Signed in as ${trimmedName}`;
  }

  if (trimmedEmail) {
    return `Signed in as ${trimmedEmail}`;
  }

  return "Signed in";
}

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  const session = await requireUser();
  const [profile, unreadCount] = await Promise.all([
    getUserProfile(session.user.id),
    getUnreadNotificationCount(session.user.id),
  ]);

  const description = profileSignedInDescription(
    profile?.name ?? session.user.name,
    session.user.email,
  );

  return (
    <Section>
      <PageHeader title="My Profile" description={description} />
      <div className="mx-auto mt-8 max-w-5xl">
        <ProfileNav unreadCount={unreadCount} />
        <div className="mt-8">{children}</div>
      </div>
    </Section>
  );
}
