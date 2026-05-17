import type { Metadata } from "next";
import Link from "next/link";
import { AskFatwaForm } from "@/components/fatwa/AskFatwaForm";
import { PageHeader } from "@/components/site/PageHeader";
import { Section } from "@/components/site/Section";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Ask a Question",
  description: "Submit your Islamic question to Darse Quran Academy scholars.",
};

export default async function FatwaAskPage({
  searchParams,
}: {
  searchParams: Promise<{ submitted?: string }>;
}) {
  const params = await searchParams;
  const session = await auth();
  const submitted = params.submitted === "1";

  return (
    <Section>
      <PageHeader
        title="Ask a question"
        description="Submit a question on Islam, Atheism, fatwa, or related topics. We will email you when it is answered."
      />

      <p className="mt-4 text-center text-sm text-muted">
        <Link href="/fatwa" className="font-medium text-primary hover:underline">
          ← Browse answered questions
        </Link>
      </p>

      {submitted && (
        <p className="mx-auto mt-6 max-w-xl rounded-lg bg-violet-50 px-4 py-3 text-center text-sm text-violet-900">
          Thank you. Your question has been received. We will email you when a scholar publishes an answer.
        </p>
      )}

      <div className="mx-auto mt-8 max-w-xl">
        <AskFatwaForm
          defaultName={session?.user?.name ?? ""}
          defaultEmail={session?.user?.email ?? ""}
          isLoggedIn={Boolean(session?.user)}
        />
      </div>
    </Section>
  );
}
