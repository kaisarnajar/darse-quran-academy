export function StatusBadge({ published }: { published: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
        published ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
      }`}
    >
      {published ? "Published" : "Draft"}
    </span>
  );
}
