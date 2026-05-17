import Link from "next/link";

type SectionHeaderProps = {
  title: string;
  description?: string;
  linkHref?: string;
  linkLabel?: string;
};

export function SectionHeader({ title, description, linkHref, linkLabel }: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
      <div className="min-w-0">
        <h2 className="font-serif text-xl font-bold text-foreground sm:text-2xl">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted sm:mt-2">{description}</p>}
      </div>
      {linkHref && linkLabel && (
        <Link
          href={linkHref}
          className="inline-flex min-h-11 shrink-0 items-center text-sm font-semibold text-accent hover:text-primary sm:justify-end"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  );
}
