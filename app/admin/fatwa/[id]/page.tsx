import Link from "next/link";
import { notFound } from "next/navigation";
import { AnswerFatwaForm } from "@/components/admin/AnswerFatwaForm";
import { answerFatwaQuestion } from "@/app/admin/fatwa/actions";
import { getFatwaQuestionById } from "@/lib/fatwa";

export default async function AdminFatwaDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const question = await getFatwaQuestionById(id);
  if (!question) notFound();

  const answerAction = answerFatwaQuestion.bind(null, id);

  return (
    <div>
      <Link href="/admin/fatwa" className="text-sm text-primary hover:underline">
        ← Back to Fatwa Q&A
      </Link>

      <h1 className="mt-4 font-serif text-2xl font-bold text-primary">
        {question.answer ? "Edit answer" : "Answer question"}
      </h1>
      <p className="mt-1 text-sm text-muted">{question.title}</p>

      {query.saved === "1" && (
        <p className="mt-4 rounded-md bg-violet-50 px-4 py-3 text-sm text-violet-800">
          Answer published. The asker has been notified by email.
        </p>
      )}

      {query.error && (
        <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {decodeURIComponent(query.error)}
        </p>
      )}

      {question.answer && question.answeredAt && (
        <p className="mt-4 text-sm text-muted">
          First answered{" "}
          {question.answeredAt.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
          {question.answer ? " · Visible on the public Fatwa section" : ""}
        </p>
      )}

      <div className="mt-8">
        <AnswerFatwaForm question={question} action={answerAction} />
      </div>

      {question.answer && (
        <p className="mt-6 text-sm text-muted">
          Public link:{" "}
          <Link href={`/fatwa/${question.id}`} className="text-primary hover:underline" target="_blank">
            /fatwa/{question.id}
          </Link>
        </p>
      )}
    </div>
  );
}
