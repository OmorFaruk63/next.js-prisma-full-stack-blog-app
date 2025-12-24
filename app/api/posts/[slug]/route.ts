import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { updatePostSchema } from "@/lib/validators/post";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ slug: string }>;
  }
) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: { select: { name: true } },
      comments: true,
    },
  });

  if (!post || !post.published) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post || post.authorId !== user.id) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const data = updatePostSchema.parse(body);

  const updated = await prisma.post.update({
    where: { slug },
    data,
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post || post.authorId !== user.id) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  await prisma.post.delete({ where: { slug } });

  return NextResponse.json({ message: "Deleted" });
}
