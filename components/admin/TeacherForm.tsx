import type { Teacher } from "@prisma/client";
import { inputClassName, labelClassName } from "@/lib/form";

type TeacherFormProps = {
  teacher?: Teacher;
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
};

export function TeacherForm({ teacher, action, submitLabel }: TeacherFormProps) {
  return (
    <form action={action} className="mx-auto max-w-2xl space-y-5">
      <div>
        <label htmlFor="name" className={labelClassName}>
          Name
        </label>
        <input id="name" name="name" required defaultValue={teacher?.name} className={inputClassName} />
      </div>
      <div>
        <label htmlFor="email" className={labelClassName}>
          Login email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          defaultValue={teacher?.email ?? ""}
          placeholder="teacher@example.com"
          className={inputClassName}
        />
        <p className="mt-1.5 text-xs text-muted">
          The teacher signs in at Teacher Login with this email after registering an account.
        </p>
      </div>
      <div>
        <label htmlFor="specialization" className={labelClassName}>
          Specialization
        </label>
        <input
          id="specialization"
          name="specialization"
          required
          defaultValue={teacher?.specialization}
          className={inputClassName}
        />
      </div>
      <div>
        <label htmlFor="bio" className={labelClassName}>
          Bio
        </label>
        <textarea id="bio" name="bio" required rows={4} defaultValue={teacher?.bio} className={inputClassName} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="initials" className={labelClassName}>
            Initials (avatar)
          </label>
          <input
            id="initials"
            name="initials"
            required
            maxLength={4}
            defaultValue={teacher?.initials}
            className={inputClassName}
          />
        </div>
        <div>
          <label htmlFor="imageUrl" className={labelClassName}>
            Photo URL (optional)
          </label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="url"
            defaultValue={teacher?.imageUrl ?? ""}
            placeholder="https://..."
            className={inputClassName}
          />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="published"
          defaultChecked={teacher?.published ?? true}
          className="h-4 w-4 rounded border-border"
        />
        Published
      </label>
      {teacher && (
        <p className="text-xs text-muted">
          ID: <code className="rounded bg-background px-1">{teacher.id}</code>
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
