import type { LibraryItem } from "@prisma/client";
import { HOMEPAGE_FEATURED_RESOURCES_MAX } from "@/lib/library";
import { inputClassName, labelClassName } from "@/lib/form";

type LibraryFormProps = {
  item?: LibraryItem;
  featuredCount: number;
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
};

export function LibraryForm({ item, featuredCount, action, submitLabel }: LibraryFormProps) {
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
      <div className="space-y-3 rounded-lg border border-border bg-background/40 px-4 py-4">
        <label className="flex cursor-pointer items-start gap-3 text-sm text-foreground">
          <input
            type="checkbox"
            name="published"
            defaultChecked={item?.published ?? true}
            className="mt-1 rounded border-border"
          />
          <span>
            <span className="font-medium">Published</span>
            <span className="mt-0.5 block text-muted">Uncheck to hide from the public library.</span>
          </span>
        </label>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-foreground">
          <input
            type="checkbox"
            name="featuredOnHomepage"
            defaultChecked={item?.featuredOnHomepage ?? false}
            className="mt-1 rounded border-border"
          />
          <span>
            <span className="font-medium">Show on homepage</span>
            <span className="mt-0.5 block text-muted">
              Featured in the Featured Resources section when published (up to {HOMEPAGE_FEATURED_RESOURCES_MAX};{" "}
              {featuredCount}/{HOMEPAGE_FEATURED_RESOURCES_MAX} slots used). All published items still appear in
              the library.
            </span>
          </span>
        </label>
      </div>
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
