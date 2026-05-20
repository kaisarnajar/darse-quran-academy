import type { AnnouncementCategory, CourseAnnouncement } from "@prisma/client";
import Link from "next/link";
import { ANNOUNCEMENT_CATEGORIES, announcementCategoryLabels } from "@/lib/announcements";
import { inputClassName, labelClassName } from "@/lib/form";

type AnnouncementFormProps = {
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
  announcement?: Pick<
    CourseAnnouncement,
    "category" | "title" | "body" | "attachmentPath" | "attachmentName"
  >;
  defaultCategory?: AnnouncementCategory;
  audienceHint?: string;
  error?: string;
};

export function AnnouncementForm({
  action,
  submitLabel,
  announcement,
  defaultCategory = "COURSE_ANNOUNCEMENT",
  audienceHint,
  error,
}: AnnouncementFormProps) {
  const hasAttachment = Boolean(announcement?.attachmentPath && announcement?.attachmentName);

  return (
    <form action={action} encType="multipart/form-data" className="mx-auto max-w-2xl space-y-5">
      {error && (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {error}
        </p>
      )}

      <div>
        <label htmlFor="category" className={labelClassName}>
          Category
        </label>
        <select
          id="category"
          name="category"
          required
          defaultValue={announcement?.category ?? defaultCategory}
          className={inputClassName}
        >
          {ANNOUNCEMENT_CATEGORIES.map((value) => (
            <option key={value} value={value}>
              {announcementCategoryLabels[value as AnnouncementCategory]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="title" className={labelClassName}>
          Title
        </label>
        <input
          id="title"
          name="title"
          required
          maxLength={200}
          defaultValue={announcement?.title ?? ""}
          placeholder="e.g. Mid-term exam schedule"
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="body" className={labelClassName}>
          Message
        </label>
        <textarea
          id="body"
          name="body"
          required
          rows={8}
          defaultValue={announcement?.body ?? ""}
          placeholder="Write the full announcement for your students…"
          className={inputClassName}
        />
        <p className="mt-1.5 text-xs text-muted">
          {audienceHint ?? "Students enrolled in this course will see this announcement."}
        </p>
      </div>

      <div>
        <label htmlFor="attachment" className={labelClassName}>
          Material (optional)
        </label>
        {hasAttachment && (
          <div className="mb-3 rounded-lg border border-border bg-background/50 px-4 py-3">
            <p className="text-xs text-muted">Current file</p>
            <Link
              href={announcement!.attachmentPath!}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-sm font-medium text-teal hover:underline"
            >
              {announcement!.attachmentName}
            </Link>
            <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-foreground">
              <input type="checkbox" name="removeAttachment" value="1" className="rounded border-border" />
              Remove current file
            </label>
          </div>
        )}
        <input
          id="attachment"
          name="attachment"
          type="file"
          accept=".pdf,.doc,.docx,image/jpeg,image/png,image/webp,image/gif"
          className="mt-1 block w-full text-sm text-foreground file:mr-4 file:rounded-full file:border-0 file:bg-teal/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-teal hover:file:bg-teal/20"
        />
        <p className="mt-1.5 text-xs text-muted">
          PDF, Word (.doc, .docx), or image — up to 10 MB. Leave empty if you only need a text announcement.
        </p>
      </div>

      <button
        type="submit"
        className="min-h-11 w-full rounded-full bg-teal px-4 py-3 text-sm font-semibold text-white transition-colors hover:opacity-90 sm:w-auto sm:px-8"
      >
        {submitLabel}
      </button>
    </form>
  );
}
