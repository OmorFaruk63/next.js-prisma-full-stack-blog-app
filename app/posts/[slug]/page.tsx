import CommentSection from "@/components/comment-section";
import prisma from "@/lib/prisma";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug: slug },
  });

  return {
    title: post?.title,
    description: post?.content.slice(0, 150),
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
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: true,
      comments: {
        where: { parentId: null },
        include: {
          user: true,
          replies: {
            include: { user: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!post) return null;

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">{post.title}</h1>

      <p className="text-sm text-gray-500 mb-6">By {post.author.name}</p>

      <article className="prose max-w-none mb-10">{post.content}</article>

      {/* Comments */}
      <CommentSection postId={post.id} comments={post.comments} />
    </main>
  );
}
