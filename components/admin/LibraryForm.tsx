import type { LibraryItem } from "@prisma/client";
import { inputClassName, labelClassName } from "@/lib/form";

type LibraryFormProps = {
  item?: LibraryItem;
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
};

export function LibraryForm({ item, action, submitLabel }: LibraryFormProps) {
  return (
    <form action={action} className="mx-auto max-w-2xl space-y-5">
      <div>
        <label htmlFor="title" className={labelClassName}>
          Title
        </label>
        <input id="title" name="title" required defaultValue={item?.title} className={inputClassName} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="author" className={labelClassName}>
            Author
          </label>
          <input id="author" name="author" required defaultValue={item?.author} className={inputClassName} />
        </div>
        <div>
          <label htmlFor="topic" className={labelClassName}>
            Topic
          </label>
          <input id="topic" name="topic" required defaultValue={item?.topic} className={inputClassName} />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="level" className={labelClassName}>
            Level
          </label>
          <select id="level" name="level" defaultValue={item?.level ?? "Beginner"} className={inputClassName}>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
        <div>
          <label htmlFor="language" className={labelClassName}>
            Language
          </label>
          <input id="language" name="language" required defaultValue={item?.language} className={inputClassName} />
        </div>
      </div>
      <div>
        <label htmlFor="pdfUrl" className={labelClassName}>
          PDF URL (optional)
        </label>
        <input
          id="pdfUrl"
          name="pdfUrl"
          type="url"
          defaultValue={item?.pdfUrl ?? ""}
          placeholder="https://..."
          className={inputClassName}
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="published"
          defaultChecked={item?.published ?? true}
          className="h-4 w-4 rounded border-border"
        />
        Published
      </label>
      {item && (
        <p className="text-xs text-muted">
          ID: <code className="rounded bg-background px-1">{item.id}</code>
        </p>
      )}
      <button
        type="submit"
        className="min-h-11 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-light"
      >
        {submitLabel}
      </button>
    </form>
  );
}
