import type { Metadata } from "next";
import { Suspense } from "react";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Section } from "@/components/site/Section";

export const metadata: Metadata = {
  title: "Register",
  description: "Create an account at Darse Quran Academy.",
};

const googleEnabled =
  Boolean(process.env.AUTH_GOOGLE_ID) && Boolean(process.env.AUTH_GOOGLE_SECRET);

export default function RegisterPage() {
  return (
    <Section>
      <Suspense fallback={<p className="text-center text-muted">Loading…</p>}>
        <RegisterForm googleEnabled={googleEnabled} />
      </Suspense>
    </Section>
  );
}
