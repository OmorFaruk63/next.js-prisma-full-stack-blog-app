// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/sendVerificationEmail";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      if (existingUser.emailVerified) {
        return NextResponse.json(
          { message: "Email already registered" },
          { status: 400 }
        );
      }
      // Optional: allow re-sending verification if not verified yet
      // For simplicity, we block re-registration with same email
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 1. Create user (unverified)
    const user = await prisma.user.create({
      data: {
        name: name || email.split("@")[0],
        email,
        password: hashedPassword,
        // role: "USER" ← already default in schema
      },
    });

    // 2. Create verification token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    // 3. Send verification email (implement this function!)
    const verificationUrl = `${
      process.env.NEXT_PUBLIC_APP_URL
    }/api/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

    await sendVerificationEmail({
      to: email,
      name: name || "there",
      verificationUrl,
    });

    return NextResponse.json(
      {
        message:
          "Registration successful! Please check your email to verify your account.",
        redirect: "/verify-email?email=" + encodeURIComponent(email),
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong. Please try again.", error },
      { status: 500 }
    );
  }
}
