import type { SiteAnnouncement } from "@prisma/client";
import { inputClassName, labelClassName } from "@/lib/form";
import { HOMEPAGE_SITE_ANNOUNCEMENT_LIMIT } from "@/lib/site-announcements";
import Image from "next/image";

type SiteAnnouncementFormProps = {
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
  announcement?: SiteAnnouncement;
  error?: string;
};

export function SiteAnnouncementForm({
  action,
  submitLabel,
  announcement,
  error,
}: SiteAnnouncementFormProps) {
  const hasImage = Boolean(announcement?.imagePath);

  return (
    <form action={action} encType="multipart/form-data" className="mx-auto max-w-2xl space-y-5">
      {error && (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {error}
        </p>
      )}

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
          placeholder="e.g. Guest Mufti visit — Masjid Al-Noor"
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="eventDate" className={labelClassName}>
          Event date (optional)
        </label>
        <input
          id="eventDate"
          name="eventDate"
          maxLength={120}
          defaultValue={announcement?.eventDate ?? ""}
          placeholder="e.g. Saturday, 15 June 2026"
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="location" className={labelClassName}>
          Location (optional)
        </label>
        <input
          id="location"
          name="location"
          maxLength={200}
          defaultValue={announcement?.location ?? ""}
          placeholder="e.g. Masjid Al-Noor, Srinagar"
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="body" className={labelClassName}>
          Announcement
        </label>
        <textarea
          id="body"
          name="body"
          required
          rows={8}
          defaultValue={announcement?.body ?? ""}
          placeholder="Full details for students and visitors…"
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="image" className={labelClassName}>
          Photo (optional)
        </label>
        {hasImage && (
          <div className="mb-3 overflow-hidden rounded-lg border border-border bg-background/50">
            <div className="relative aspect-[16/10] max-h-56 w-full">
              <Image
                src={announcement!.imagePath!}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 672px) 100vw, 672px"
              />
            </div>
            <label className="flex cursor-pointer items-center gap-2 px-4 py-3 text-sm text-foreground">
              <input type="checkbox" name="removeImage" className="rounded border-border" />
              Remove current photo
            </label>
          </div>
        )}
        <input
          id="image"
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="mt-1 block w-full text-sm text-foreground file:mr-4 file:rounded-full file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary"
        />
        <p className="mt-1.5 text-xs text-muted">JPEG, PNG, WebP, or GIF — up to 5 MB. One photo per announcement.</p>
      </div>

      <div className="space-y-3 rounded-lg border border-border bg-background/40 px-4 py-4">
        <label className="flex cursor-pointer items-start gap-3 text-sm text-foreground">
          <input
            type="checkbox"
            name="showOnHomepage"
            defaultChecked={announcement?.showOnHomepage ?? false}
            className="mt-1 rounded border-border"
          />
          <span>
            <span className="font-medium">Show on homepage</span>
            <span className="mt-0.5 block text-muted">
              Featured on the main page when published (up to {HOMEPAGE_SITE_ANNOUNCEMENT_LIMIT}{" "}
              most recent). All published announcements still appear on the Announcements page.
            </span>
          </span>
        </label>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-foreground">
          <input
            type="checkbox"
            name="published"
            defaultChecked={announcement?.published ?? true}
            className="mt-1 rounded border-border"
          />
          <span>
            <span className="font-medium">Published</span>
            <span className="mt-0.5 block text-muted">Uncheck to save as draft (hidden from the public site).</span>
          </span>
        </label>
      </div>

      <button
        type="submit"
        className="min-h-11 w-full rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-light sm:w-auto sm:px-8"
      >
        {submitLabel}
      </button>
    </form>
  );
}
