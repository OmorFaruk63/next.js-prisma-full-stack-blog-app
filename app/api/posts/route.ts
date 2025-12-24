import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { createPostSchema } from "@/lib/validators/post";
import { generateSlug } from "@/lib/slug";

// Create a new post
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = createPostSchema.parse(body);

    const slug = generateSlug(data.title);

    const exists = await prisma.post.findUnique({
      where: { slug },
    });

    if (exists) {
      return NextResponse.json(
        { message: "Post with this title already exists" },
        { status: 409 }
      );
    }

    const post = await prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        slug,
        published: data.published ?? false,
        authorId: user.id,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }
}

// Get all posts
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") ?? 1);
  const limit = 10;
  const skip = (page - 1) * limit;

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
    select: {
      id: true,
      title: true,
      slug: true,
      createdAt: true,
      author: {
        select: { name: true },
      },
    },
  });

  return NextResponse.json(posts);
}
