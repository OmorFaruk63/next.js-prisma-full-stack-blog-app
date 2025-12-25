import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug: slug },
    include: {
      author: { select: { name: true } },
      comments: {
        where: { parentId: null },
        orderBy: { createdAt: "asc" },
        include: {
          user: { select: { name: true } },
          replies: {
            include: {
              user: { select: { name: true } },
            },
          },
        },
      },
    },
  });

  if (!post || !post.published) {
    notFound();
  }

  return (
    <main className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>

      <p className="text-sm text-gray-500 mb-6">By {post.author.name}</p>

      <article className="prose max-w-none">{post.content}</article>

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Comments</h2>

        <div className="space-y-4">
          {post.comments.map((comment) => (
            <div key={comment.id} className="border p-3 rounded">
              <p className="font-medium">{comment.user.name}</p>
              <p>{comment.content}</p>

              {comment.replies.length > 0 && (
                <div className="ml-4 mt-3 space-y-2">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="border p-2 rounded">
                      <p className="font-medium">{reply.user.name}</p>
                      <p>{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
