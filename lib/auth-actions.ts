"use server";

import { auth } from "@/lib/auth";
import { isAdminSession } from "@/lib/admin";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const session = await auth();
  if (!isAdminSession(session)) {
    redirect("/login?callbackUrl=/admin");
  }
  return session!;
}
