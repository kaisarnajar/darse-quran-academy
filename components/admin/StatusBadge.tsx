export function StatusBadge({ published }: { published: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
        published ? "bg-violet-100 text-violet-800" : "bg-stone-200 text-stone-700"
      }`}
    >
      {published ? "Published" : "Draft"}
    </span>
  );
}
