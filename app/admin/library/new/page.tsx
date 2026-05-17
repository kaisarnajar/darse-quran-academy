import Link from "next/link";
import { LibraryForm } from "@/components/admin/LibraryForm";
import { createLibraryItem } from "@/app/admin/library/actions";

export default function NewLibraryPage() {
  return (
    <div>
      <Link href="/admin/library" className="text-sm text-primary hover:underline">
        ← Back to library
      </Link>
      <h1 className="mt-4 font-serif text-2xl font-bold text-primary">Add library item</h1>
      <div className="mt-8">
        <LibraryForm action={createLibraryItem} submitLabel="Create item" />
      </div>
    </div>
  );
}
