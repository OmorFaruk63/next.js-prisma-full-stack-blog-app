import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function HomePage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 10,
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

  return (
    <main className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Blog</h1>

      <div className="space-y-6">
        {posts.map((post) => (
          <article key={post.id} className="border-b pb-4">
            <Link
              href={`/posts/${post.slug}`}
              className="text-xl font-semibold hover:underline"
            >
              {post.title}
            </Link>

            <p className="text-sm text-gray-500 mt-1">
              By {post.author.name} • {new Date(post.createdAt).toDateString()}
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}
