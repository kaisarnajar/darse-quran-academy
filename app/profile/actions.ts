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
    fatherName: formData.get("fatherName"),
    dateOfBirth: formData.get("dateOfBirth"),
    occupation: formData.get("occupation"),
    address: formData.get("address"),
    whatsapp: formData.get("whatsapp"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid profile data." };
  }

  const whatsapp = parsed.data.whatsapp.replace(/\s|-/g, "");

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: parsed.data.name,
      fatherName: parsed.data.fatherName,
      dateOfBirth: new Date(parsed.data.dateOfBirth),
      occupation: parsed.data.occupation,
      address: parsed.data.address,
      whatsapp,
    },
  });

  revalidatePath("/profile");
  revalidatePath("/profile/courses");
  revalidatePath("/courses");

  return { success: "Profile updated." };
}
