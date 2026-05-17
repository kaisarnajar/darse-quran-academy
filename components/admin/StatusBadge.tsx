export function StatusBadge({ published }: { published: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
        published ? "bg-sky-100 text-sky-800" : "bg-slate-200 text-slate-700"
      }`}
    >
      {published ? "Published" : "Draft"}
    </span>
  );
}
