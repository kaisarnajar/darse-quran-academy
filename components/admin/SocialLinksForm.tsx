import type { SocialLinksSettingsData } from "@/lib/social-links";
import { formatWhatsAppForDisplay } from "@/lib/social-links";
import { inputClassName, labelClassName } from "@/lib/form";

type SocialLinksFormProps = {
  settings: SocialLinksSettingsData;
  action: (formData: FormData) => Promise<void>;
};

export function SocialLinksForm({ settings, action }: SocialLinksFormProps) {
  const whatsappPreview = formatWhatsAppForDisplay(settings.whatsappNumber);

  return (
    <form action={action} className="mx-auto max-w-2xl space-y-8">
      <section className="space-y-4 rounded-lg border border-border bg-background/40 p-5">
        <h2 className="font-serif text-lg font-semibold text-foreground">WhatsApp</h2>
        <p className="text-sm text-muted">
          Used for the floating chat button, footer contact, and About page. Enter with country code
          (e.g. +91 70060 25120).
        </p>
        <div>
          <label htmlFor="whatsappNumber" className={labelClassName}>
            WhatsApp number
          </label>
          <input
            id="whatsappNumber"
            name="whatsappNumber"
            type="tel"
            required
            placeholder="+91 70060 25120"
            defaultValue={whatsappPreview || settings.whatsappNumber}
            className={inputClassName}
          />
        </div>
        <div>
          <label htmlFor="whatsappDefaultMessage" className={labelClassName}>
            Default chat message
          </label>
          <textarea
            id="whatsappDefaultMessage"
            name="whatsappDefaultMessage"
            rows={3}
            defaultValue={settings.whatsappDefaultMessage}
            className={inputClassName}
          />
          <p className="mt-1.5 text-xs text-muted">Pre-filled when someone opens WhatsApp from the site.</p>
        </div>
      </section>

      <section className="space-y-4 rounded-lg border border-border bg-background/40 p-5">
        <h2 className="font-serif text-lg font-semibold text-foreground">Social networks</h2>
        <p className="text-sm text-muted">
          Shown in the top bar and footer. Leave a field blank to hide that network on the public site.
        </p>
        <div>
          <label htmlFor="facebookUrl" className={labelClassName}>
            Facebook URL
          </label>
          <input
            id="facebookUrl"
            name="facebookUrl"
            type="url"
            placeholder="https://facebook.com/yourpage"
            defaultValue={settings.facebookUrl}
            className={inputClassName}
          />
        </div>
        <div>
          <label htmlFor="instagramUrl" className={labelClassName}>
            Instagram URL
          </label>
          <input
            id="instagramUrl"
            name="instagramUrl"
            type="url"
            placeholder="https://instagram.com/yourpage"
            defaultValue={settings.instagramUrl}
            className={inputClassName}
          />
        </div>
        <div>
          <label htmlFor="youtubeUrl" className={labelClassName}>
            YouTube URL
          </label>
          <input
            id="youtubeUrl"
            name="youtubeUrl"
            type="url"
            placeholder="https://youtube.com/@yourchannel"
            defaultValue={settings.youtubeUrl}
            className={inputClassName}
          />
        </div>
      </section>

      <button
        type="submit"
        className="min-h-11 rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-light"
      >
        Save social links
      </button>
    </form>
  );
}
