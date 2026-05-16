import type { LibraryItem } from "@/content/library";

type LibraryCardProps = {
  item: LibraryItem;
};

export function LibraryCard({ item }: LibraryCardProps) {
  return (
    <article className="flex flex-col rounded-lg border border-border bg-surface p-6 shadow-sm">
      <span className="w-fit rounded-full bg-accent-muted px-2.5 py-0.5 text-xs font-medium text-primary">
        {item.topic}
      </span>
      <h3 className="mt-3 font-serif text-lg font-semibold text-foreground">{item.title}</h3>
      <p className="mt-1 text-sm text-muted">by {item.author}</p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted">
        <span className="rounded bg-background px-2 py-1">{item.level}</span>
        <span className="rounded bg-background px-2 py-1">{item.language}</span>
      </div>
      <button
        type="button"
        className="mt-4 w-full rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
      >
        PDF Coming Soon
      </button>
    </article>
  );
}
