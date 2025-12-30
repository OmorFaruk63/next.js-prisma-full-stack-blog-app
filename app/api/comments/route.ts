import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { createCommentSchema } from "@/lib/validators/comment";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = createCommentSchema.parse(body);

    const comment = await prisma.comment.create({
      data: {
        content: data.content,
        postId: String(data.postId),
        parentId: data.parentId ? String(data.parentId) : null,
        userId: user.id,
      },
      include: {
        user: { select: { name: true } },
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: error?.message || "Invalid input" },
      { status: 400 }
    );
  }
}
