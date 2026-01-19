// app/dashboard/edit/[slug]/page.tsx
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import EditForm from "./EditForm";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const post = await prisma.post.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      published: true,
      authorId: true,
    },
  });

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-red-400 mb-4">404</h1>
          <p>Post not found or you don&apos;t have permission to edit it.</p>
        </div>
      </div>
    );
  }

  // Security: only author can edit
  if (post.authorId !== currentUser.id) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-red-400 mb-4">
            Access Denied
          </h1>
          <p>You are not the author of this post.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-gray-950 via-indigo-950 to-gray-950 pt-6 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-linear-to-r from-cyan-400 via-purple-500 to-pink-500 animate-pulse-slow">
            Edit Post
          </h1>
          <p className="mt-3 text-gray-400">
            Refine your vision — the future is listening
          </p>
        </div>

        <div className="relative bg-gray-900/40 backdrop-blur-xl border border-gray-800/70 rounded-2xl p-8 shadow-2xl shadow-purple-900/20">
          {/* Subtle animated overlay */}
          <div className="absolute inset-0 bg-linear-to-br from-cyan-900/8 via-purple-900/8 to-pink-900/8 pointer-events-none" />

          <EditForm initialPost={post} />
        </div>
      </div>
    </main>
  );
}
