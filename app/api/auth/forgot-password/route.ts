import { NextResponse } from "next/server";
import { sendPasswordResetEmail } from "@/lib/email";
import { buildPasswordResetUrl, createPasswordResetToken } from "@/lib/password-reset";
import { forgotPasswordSchema } from "@/lib/validations";

const GENERIC_SUCCESS =
  "If an account with that email exists and uses a password, we sent reset instructions.";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = forgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid email." },
        { status: 400 },
      );
    }

    const token = await createPasswordResetToken(parsed.data.email);

    if (token) {
      const resetUrl = buildPasswordResetUrl(token);
      await sendPasswordResetEmail({ to: parsed.data.email.toLowerCase().trim(), resetUrl });
    }

    return NextResponse.json({ success: true, message: GENERIC_SUCCESS });
  } catch {
    return NextResponse.json(
      { error: "Could not process your request. Please try again later." },
      { status: 500 },
    );
  }
}
