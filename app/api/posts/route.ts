import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client"; // Import Prisma for error types

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const post = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        slug: body.slug,
        authorId: user.id,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    // Check if the error is a known Prisma error
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // P2002 is the code for unique constraint violation
      if (error.code === "P2002") {
        return NextResponse.json(
          { message: "A post with this slug already exists." },
          { status: 400 }
        );
      }
    }

    // Generic error handling
    console.error("Post Creation Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
