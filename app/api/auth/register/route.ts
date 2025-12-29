// app/api/auth/register/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/validators/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = registerSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        // emailVerified: null, // already default null in your schema
      },
    });

    // ─── THIS IS THE PART YOU ASKED ABOUT ─────────────────────────────
    return NextResponse.json({
      message: "Account created! Please check your email to verify.",
      redirect: `/verify-email?email=${encodeURIComponent(data.email)}`,
    });
    // ─────────────────────────────────────────────────────────────────
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
