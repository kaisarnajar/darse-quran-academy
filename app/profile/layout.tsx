import type { Metadata } from "next";
import { ProfileNav } from "@/components/profile/ProfileNav";
import { PageHeader } from "@/components/site/PageHeader";
import { Section } from "@/components/site/Section";
import { requireUser } from "@/lib/auth-actions";

export const metadata: Metadata = {
  title: "My Profile",
  description: "Manage your profile, payments, and courses at Darse Quran Academy.",
};

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  const session = await requireUser();

  return (
    <Section>
      <PageHeader
        title="My Profile"
        description={`Signed in as ${session.user.email}`}
      />
      <div className="mx-auto mt-8 max-w-5xl">
        <ProfileNav />
        <div className="mt-8">{children}</div>
      </div>
    </Section>
  );
}
