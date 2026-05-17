import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { requireAdmin } from "@/lib/auth-actions";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="min-h-[calc(100vh-4rem)] md:flex">
      <AdminSidebar />
      <div className="flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
    </div>
  );
}
