"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth-actions";
import { prisma } from "@/lib/prisma";
import { profileUpdateSchema } from "@/lib/validations";

export type ProfileUpdateState = {
  error?: string;
  success?: string;
};

export async function updateProfile(
  _prev: ProfileUpdateState,
  formData: FormData,
): Promise<ProfileUpdateState> {
  const session = await requireUser();

  const parsed = profileUpdateSchema.safeParse({
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid profile data." };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name: parsed.data.name },
  });

  revalidatePath("/profile");
  revalidatePath("/profile/courses");

  return { success: "Profile updated." };
}
