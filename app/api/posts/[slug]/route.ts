// app/api/posts/[slug]/route.ts
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
  },
) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: { select: { name: true } },
      comments: true,
    },
  });

  if (!post) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const post = await prisma.post.findUnique({ where: { slug } });

  if (!post) {
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
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    // 1. Get current user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { message: "You must be logged in to delete a post" },
        { status: 401 },
      );
    }

    // 2. Find the post
    const post = await prisma.post.findUnique({
      where: { slug },
      select: {
        id: true,
        authorId: true,
        title: true, // optional - useful for message
      },
    });

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    // 3. Authorization check
    const isAuthor = user.id === post.authorId;
    const isAdmin = user.role === "ADMIN";

    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        {
          message:
            "You are not authorized to delete this post. Only the author or an admin can delete it.",
          reason: "insufficient_permissions",
          requiredRole: ["AUTHOR", "ADMIN"],
          yourRole: user.role,
        },
        { status: 403 },
      );
    }

    // 4. Delete the post (comments will be deleted automatically thanks to onDelete: Cascade)
    await prisma.post.delete({
      where: { slug },
    });

    return NextResponse.json(
      {
        message: "Post deleted successfully",
        deletedPost: { slug, title: post.title },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[POST_DELETE_ERROR]", error);

    // Prisma-specific error handling (optional but recommended)
    if (
      error instanceof Error &&
      error.message.includes("Foreign key constraint")
    ) {
      return NextResponse.json(
        {
          message:
            "Cannot delete post due to linked comments (database constraint)",
          error: "foreign_key_constraint",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        message: "Something went wrong while deleting the post",
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
