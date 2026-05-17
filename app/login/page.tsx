import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { Section } from "@/components/site/Section";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to Darse Quran Academy to enroll in courses.",
};

const googleEnabled =
  Boolean(process.env.AUTH_GOOGLE_ID) && Boolean(process.env.AUTH_GOOGLE_SECRET);

export default function LoginPage() {
  return (
    <Section>
      <Suspense fallback={<p className="text-center text-muted">Loading…</p>}>
        <LoginForm googleEnabled={googleEnabled} />
      </Suspense>
    </Section>
  );
}
