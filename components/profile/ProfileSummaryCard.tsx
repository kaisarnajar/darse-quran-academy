import type { Occupation } from "@prisma/client";
import { getInitialsFromName } from "@/lib/student-reviews";
import { occupationLabel } from "@/lib/profile";

type ProfileSummaryCardProps = {
  name: string | null;
  email: string;
  memberSince: Date;
  profileComplete: boolean;
  occupation: Occupation | null;
};

export function ProfileSummaryCard({
  name,
  email,
  memberSince,
  profileComplete,
  occupation,
}: ProfileSummaryCardProps) {
  const displayName = name?.trim() || "Student";
  const initials = getInitialsFromName(displayName);

  return (
    <aside className="card-elevated overflow-hidden">
      <div className="pattern-teal px-6 py-8 text-center">
        <div
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-white/20 bg-teal-dark text-xl font-bold text-white shadow-lg"
          aria-hidden
        >
          {initials}
        </div>
        <h2 className="mt-4 font-serif text-xl font-semibold text-white">{displayName}</h2>
        <p className="mt-1 text-sm text-white/80">{email}</p>
      </div>

      <div className="space-y-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">Profile status</span>
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
              profileComplete
                ? "bg-emerald-100 text-emerald-900"
                : "bg-amber-100 text-amber-900"
            }`}
          >
            {profileComplete ? "Complete" : "Incomplete"}
          </span>
        </div>

        {occupation && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Occupation</p>
            <p className="mt-1 text-sm text-foreground">{occupationLabel(occupation)}</p>
          </div>
        )}

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Member since</p>
          <p className="mt-1 text-sm text-foreground">
            {memberSince.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
    </aside>
  );
}
