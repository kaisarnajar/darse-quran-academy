"use client";

import type { AnnouncementCategory, CourseAnnouncement } from "@prisma/client";
import Link from "next/link";
import { useState } from "react";
import {
  ANNOUNCEMENT_CATEGORIES,
  ANNOUNCEMENT_LARGE_FILE_MESSAGE,
  ANNOUNCEMENT_MAX_UPLOAD_BYTES,
  announcementCategoryLabels,
  isAnnouncementAttachmentTooLarge,
} from "@/lib/announcements";
import { inputClassName, labelClassName } from "@/lib/form";

type AnnouncementFormProps = {
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
  announcement?: Pick<
    CourseAnnouncement,
    "category" | "title" | "body" | "attachmentPath" | "attachmentName"
  >;
  error?: string;
};

export function AnnouncementForm({ action, submitLabel, announcement, error }: AnnouncementFormProps) {
  const hasAttachment = Boolean(announcement?.attachmentPath && announcement?.attachmentName);
  const [largeFileNotice, setLargeFileNotice] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  function handleAttachmentChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setLargeFileNotice(false);
      setSelectedFileName(null);
      return;
    }
    setSelectedFileName(file.name);
    setLargeFileNotice(isAnnouncementAttachmentTooLarge(file.size));
  }

  const maxMbLabel = `${ANNOUNCEMENT_MAX_UPLOAD_BYTES / (1024 * 1024)} MB`;

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
          defaultValue={announcement?.category ?? "COURSE_ANNOUNCEMENT"}
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
          placeholder="Write the full announcement for your students. Paste a Google Drive link here for larger files."
          className={inputClassName}
        />
        <p className="mt-1.5 text-xs text-muted">
          Students enrolled in this course will see this announcement. For files over {maxMbLabel}, paste a
          Google Drive link in the message.
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
          onChange={handleAttachmentChange}
          className="mt-1 block w-full text-sm text-foreground file:mr-4 file:rounded-full file:border-0 file:bg-teal/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-teal hover:file:bg-teal/20"
        />
        <p className="mt-1.5 text-xs text-muted">
          PDF, Word (.doc, .docx), or image — up to {maxMbLabel} only. Leave empty if you only need a text
          announcement.
        </p>
        {largeFileNotice && selectedFileName && (
          <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900" role="alert">
            <span className="font-medium">{selectedFileName}</span> is larger than {maxMbLabel}.{" "}
            {ANNOUNCEMENT_LARGE_FILE_MESSAGE}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={largeFileNotice}
        className="min-h-11 w-full rounded-full bg-teal px-4 py-3 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-8"
      >
        {submitLabel}
      </button>
    </form>
  );
}
