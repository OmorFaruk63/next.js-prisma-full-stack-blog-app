import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { postId } = await params;

  const comments = await prisma.comment.findMany({
    where: {
      postId: Number(postId),
      parentId: null,
    },
    orderBy: { createdAt: "asc" },
    include: {
      user: { select: { name: true } },
      replies: {
        orderBy: { createdAt: "asc" },
        include: {
          user: { select: { name: true } },
        },
      },
    },
  });

  return NextResponse.json(comments);
}
