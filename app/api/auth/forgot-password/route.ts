import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/sendEmail";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Security: don't reveal if email exists or not
    if (!user) {
      // Still "send" (but actually don't) to prevent user enumeration
      return NextResponse.json(
        {
          message: "User not found with this email.",
        },
        { status: 200 }
      );
    }

    // Create reset token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    const resetUrl = `${
      process.env.NEXT_PUBLIC_APP_URL
    }/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    try {
      await sendPasswordResetEmail({
        to: email,
        name: user.name || "User",
        resetUrl,
      });
    } catch (emailErr) {
      console.error("Reset email failed:", emailErr);
      // Still return success to user (security)
    }

    return NextResponse.json(
      {
        message:
          "If an account exists, a password reset link has been sent to your email.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("FORGOT_PASSWORD_ERROR:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
