import type { FatwaQuestion } from "@prisma/client";
import { inputClassName, labelClassName } from "@/lib/form";

type AnswerFatwaFormProps = {
  question: FatwaQuestion;
  action: (formData: FormData) => Promise<void>;
};

export function AnswerFatwaForm({ question, action }: AnswerFatwaFormProps) {
  const isAnswered = Boolean(question.answer);

  return (
    <form action={action} className="mx-auto max-w-2xl space-y-5">
      <div className="rounded-lg border border-border bg-background/50 p-4 text-sm">
        <p className="font-medium text-foreground">{question.title}</p>
        <p className="mt-2 whitespace-pre-wrap text-muted">{question.question}</p>
        <p className="mt-3 text-xs text-muted">
          {question.category} · {question.askerName} · {question.askerEmail}
        </p>
      </div>

      <div>
        <label htmlFor="answer" className={labelClassName}>
          {isAnswered ? "Update answer" : "Publish answer"}
        </label>
        <textarea
          id="answer"
          name="answer"
          required
          minLength={20}
          maxLength={10000}
          rows={12}
          defaultValue={question.answer ?? ""}
          placeholder="Write the scholarly answer here…"
          className={inputClassName}
        />
        <p className="mt-1 text-xs text-muted">Minimum 20 characters. The asker will be emailed when you save.</p>
      </div>

      <button
        type="submit"
        className="min-h-11 rounded-md bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-light"
      >
        {isAnswered ? "Update answer" : "Publish answer"}
      </button>
    </form>
  );
}
