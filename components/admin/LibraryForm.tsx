import type { LibraryItem } from "@prisma/client";
import { HOMEPAGE_FEATURED_RESOURCES_MAX } from "@/lib/library";
import { getLibraryLanguageOptions, getLibraryTopicOptions } from "@/lib/library-options";
import { inputClassName, labelClassName } from "@/lib/form";

type LibraryFormProps = {
  item?: LibraryItem;
  featuredCount: number;
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
};

export function LibraryForm({ item, featuredCount, action, submitLabel }: LibraryFormProps) {
  const isCurrentlyFeatured = item?.featuredOnHomepage ?? false;
  const featuredSlotsFull = featuredCount >= HOMEPAGE_FEATURED_RESOURCES_MAX;
  const canFeatureThisItem = isCurrentlyFeatured || !featuredSlotsFull;
  const displayedFeaturedCount = Math.min(featuredCount, HOMEPAGE_FEATURED_RESOURCES_MAX);
  const topicOptions = getLibraryTopicOptions(item?.topic);
  const languageOptions = getLibraryLanguageOptions(item?.language);

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
          <select
            id="topic"
            name="topic"
            required
            defaultValue={item?.topic ?? ""}
            className={inputClassName}
          >
            <option value="" disabled>
              Select…
            </option>
            {topicOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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
          <select
            id="language"
            name="language"
            required
            defaultValue={item?.language ?? ""}
            className={inputClassName}
          >
            <option value="" disabled>
              Select…
            </option>
            {languageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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
        <label
          className={`flex items-start gap-3 text-sm text-foreground ${
            canFeatureThisItem ? "cursor-pointer" : ""
          }`}
        >
          <input
            type="checkbox"
            name="featuredOnHomepage"
            defaultChecked={isCurrentlyFeatured}
            disabled={!canFeatureThisItem}
            className="mt-1 rounded border-border disabled:cursor-not-allowed"
          />
          <span>
            <span className="font-medium">Show on homepage</span>
            {canFeatureThisItem ? (
              <span className="mt-0.5 block text-muted">
                Featured in the Featured Resources section when published (up to{" "}
                {HOMEPAGE_FEATURED_RESOURCES_MAX}; {displayedFeaturedCount}/{HOMEPAGE_FEATURED_RESOURCES_MAX}{" "}
                slots used). All published items still appear in the library.
              </span>
            ) : (
              <span className="mt-0.5 block text-muted">
                There are already {HOMEPAGE_FEATURED_RESOURCES_MAX} featured resources. Remove one resource
                from the homepage to add this item as a featured resource.
              </span>
            )}
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
