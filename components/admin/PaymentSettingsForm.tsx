import type { PaymentSettingsData } from "@/lib/payment-settings";
import { inputClassName, labelClassName } from "@/lib/form";

type PaymentSettingsFormProps = {
  settings: PaymentSettingsData;
  action: (formData: FormData) => Promise<void>;
};

export function PaymentSettingsForm({ settings, action }: PaymentSettingsFormProps) {
  return (
    <form action={action} className="mx-auto max-w-2xl space-y-8">
      <section className="space-y-4 rounded-lg border border-border bg-background/40 p-5">
        <h2 className="font-serif text-lg font-semibold text-foreground">UPI</h2>
        <p className="text-sm text-muted">
          Shown on student payment pages and used for QR codes. Leave UPI ID empty only if you do not
          accept UPI.
        </p>
        <div>
          <label htmlFor="upiId" className={labelClassName}>
            UPI ID
          </label>
          <input
            id="upiId"
            name="upiId"
            type="text"
            placeholder="yourname@bank"
            defaultValue={settings.upiId}
            className={inputClassName}
          />
        </div>
        <div>
          <label htmlFor="upiPayeeName" className={labelClassName}>
            Payee name
          </label>
          <input
            id="upiPayeeName"
            name="upiPayeeName"
            type="text"
            required
            defaultValue={settings.upiPayeeName}
            className={inputClassName}
          />
        </div>
      </section>

      <section className="space-y-4 rounded-lg border border-border bg-background/40 p-5">
        <h2 className="font-serif text-lg font-semibold text-foreground">Bank transfer</h2>
        <p className="text-sm text-muted">Displayed alongside UPI for NEFT / IMPS / RTGS.</p>
        <div>
          <label htmlFor="bankAccountName" className={labelClassName}>
            Account name
          </label>
          <input
            id="bankAccountName"
            name="bankAccountName"
            type="text"
            required
            defaultValue={settings.bankAccountName}
            className={inputClassName}
          />
        </div>
        <div>
          <label htmlFor="bankName" className={labelClassName}>
            Bank name
          </label>
          <input
            id="bankName"
            name="bankName"
            type="text"
            required
            defaultValue={settings.bankName}
            className={inputClassName}
          />
        </div>
        <div>
          <label htmlFor="bankAccountNumber" className={labelClassName}>
            Account number
          </label>
          <input
            id="bankAccountNumber"
            name="bankAccountNumber"
            type="text"
            required
            defaultValue={settings.bankAccountNumber}
            className={inputClassName}
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="bankIfsc" className={labelClassName}>
              IFSC code
            </label>
            <input
              id="bankIfsc"
              name="bankIfsc"
              type="text"
              required
              defaultValue={settings.bankIfsc}
              className={inputClassName}
            />
          </div>
          <div>
            <label htmlFor="bankBranch" className={labelClassName}>
              Branch (optional)
            </label>
            <input
              id="bankBranch"
              name="bankBranch"
              type="text"
              defaultValue={settings.bankBranch}
              className={inputClassName}
            />
          </div>
        </div>
      </section>

      <button
        type="submit"
        className="min-h-11 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-light"
      >
        Save payment details
      </button>
    </form>
  );
}
