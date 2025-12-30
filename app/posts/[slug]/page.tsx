// app/posts/[slug]/page.tsx
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import CommentForm from "@/components/CommentForm"; // ← Create this new component
import Comment from "@/components/Comment";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });

  return {
    title: post?.title || "Post Not Found",
    description: post?.content.slice(0, 150) || "",
    openGraph: {
      title: post?.title,
      description: post?.content.slice(0, 150),
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const currentUser = await getCurrentUser();

  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: { select: { name: true, image: true } },
      comments: {
        where: { parentId: null },
        include: {
          user: { select: { name: true, image: true } },
          replies: {
            include: { user: { select: { name: true, image: true } } },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!post) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-950 via-indigo-950 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 mb-4">
            404
          </h1>
          <p className="text-gray-400 text-xl">
            Post not found in this dimension
          </p>
          <Link
            href="/"
            className="mt-6 inline-block text-cyan-400 hover:text-cyan-300"
          >
            Return to Home →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-indigo-950 to-gray-950 pt-4 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Post Header */}
        <header className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 animate-pulse-slow mb-4">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-gray-400 text-sm mb-6">
            <div className="flex items-center gap-2">
              {post.author.image ? (
                <img
                  src={post.author.image}
                  alt={post.author.name || ""}
                  className="w-8 h-8 rounded-full ring-2 ring-purple-500/40"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs">
                  {(post.author.name || "A")[0].toUpperCase()}
                </div>
              )}
              <span className="font-medium text-gray-200">
                {post.author.name || "Anonymous"}
              </span>
            </div>
            <span>•</span>
            <time>{format(new Date(post.createdAt), "MMMM d, yyyy")}</time>
          </div>
        </header>

        {/* Content */}
        <article className="prose prose-invert max-w-none mb-16 prose-headings:text-cyan-300 prose-a:text-purple-400 prose-strong:text-pink-300 prose-code:bg-gray-900/60 prose-code:p-1 prose-code:rounded">
          {post.content}
        </article>

        {/* Comments Section */}
        <section className="bg-gray-900/40 backdrop-blur-xl border border-gray-800/70 rounded-2xl p-8 shadow-2xl shadow-purple-900/20">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 mb-8">
            Comments ({post.comments.length})
          </h2>

          {/* New Comment Form */}
          {currentUser ? (
            <CommentForm postId={post.id} />
          ) : (
            <div className="text-center py-6 text-gray-400 border-b border-gray-800/50 mb-8">
              <p>Sign in to join the conversation</p>
              <Link href="/login" className="text-cyan-400 hover:text-cyan-300">
                Login →
              </Link>
            </div>
          )}

          {/* Comments List */}
          {post.comments.length > 0 ? (
            <div className="space-y-10">
              {post.comments.map((comment) => (
                <div key={comment.id}>
                  {/* Top level comment */}
                  <Comment
                    id={comment.id}
                    content={comment.content}
                    createdAt={comment.createdAt}
                    user={comment.user}
                    isReply={false}
                  />

                  {/* Replies */}
                  {comment.replies?.length > 0 && (
                    <div className="mt-6 space-y-6">
                      {comment.replies.map((reply) => (
                        <Comment
                          key={reply.id}
                          id={reply.id}
                          content={reply.content}
                          createdAt={reply.createdAt}
                          user={reply.user}
                          isReply={true}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-3 text-gray-500">
              <p className="text-xl">No comments yet</p>
              <p className="mt-2">Be the first to break the silence</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
