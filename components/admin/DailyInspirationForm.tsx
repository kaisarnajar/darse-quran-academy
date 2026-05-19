import type { DailyInspirationKind } from "@prisma/client";
import { inputClassName, labelClassName } from "@/lib/form";

type DailyInspirationFormProps = {
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
  item?: {
    kind: DailyInspirationKind;
    arabicText: string;
    englishTranslation: string;
    reference: string | null;
    published: boolean;
  };
  error?: string;
};

export function DailyInspirationForm({ action, submitLabel, item, error }: DailyInspirationFormProps) {
  const kind = item?.kind ?? "QURAN";

  return (
    <form action={action} className="mx-auto max-w-2xl space-y-5">
      {error && (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {error}
        </p>
      )}

      <fieldset>
        <legend className={labelClassName}>Type</legend>
        <div className="mt-2 flex flex-wrap gap-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="radio"
              name="kind"
              value="QURAN"
              defaultChecked={kind === "QURAN"}
              className="text-primary"
            />
            Quranic verse
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="radio"
              name="kind"
              value="HADITH"
              defaultChecked={kind === "HADITH"}
              className="text-primary"
            />
            Hadith
          </label>
        </div>
      </fieldset>

      <div>
        <label htmlFor="arabicText" className={labelClassName}>
          Arabic text <span className="text-red-600">*</span>
        </label>
        <textarea
          id="arabicText"
          name="arabicText"
          required
          dir="rtl"
          rows={5}
          defaultValue={item?.arabicText ?? ""}
          placeholder="النص العربي…"
          className={`${inputClassName} indo-pak-arabic text-lg leading-loose`}
        />
      </div>

      <div>
        <label htmlFor="englishTranslation" className={labelClassName}>
          English translation <span className="text-red-600">*</span>
        </label>
        <textarea
          id="englishTranslation"
          name="englishTranslation"
          required
          rows={4}
          defaultValue={item?.englishTranslation ?? ""}
          placeholder="English meaning or translation…"
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="reference" className={labelClassName}>
          Reference (optional)
        </label>
        <input
          id="reference"
          name="reference"
          maxLength={300}
          defaultValue={item?.reference ?? ""}
          placeholder="e.g. Surah Al-Baqarah 2:255 or Sahih al-Bukhari 1"
          className={inputClassName}
        />
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="published"
          defaultChecked={item?.published ?? true}
          className="rounded border-border text-primary"
        />
        Publish on homepage (latest published entry is shown)
      </label>

      <button
        type="submit"
        className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-light"
      >
        {submitLabel}
      </button>
    </form>
  );
}
