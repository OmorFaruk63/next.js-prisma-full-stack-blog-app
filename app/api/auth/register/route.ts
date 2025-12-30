// app/api/auth/register/route.ts

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return NextResponse.json(
      { message: "Email already exists" },
      { status: 400 }
    );
  }

  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
    },
  });

  // send verification email here

  return NextResponse.json({
    redirect: "/verify-email",
  });
}
