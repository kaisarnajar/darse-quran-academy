import { auth } from "@/lib/auth";
import { getPostLoginPath } from "@/lib/auth-redirect";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function AuthContinuePage({ searchParams }: PageProps) {
  const session = await auth();
  const { callbackUrl } = await searchParams;
  const target = callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/";

  if (!session?.user) {
    redirect(`/login?callbackUrl=${encodeURIComponent(target)}`);
  }

  redirect(getPostLoginPath(session.user.role, target));
}
