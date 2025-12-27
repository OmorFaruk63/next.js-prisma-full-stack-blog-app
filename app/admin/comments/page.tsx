import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/requireRole";

export default async function AdminCommentsPage() {
  await requireRole("ADMIN");

  const comments = await prisma.comment.findMany({
    where: { approved: false },
    include: {
      user: true,
      post: true,
    },
  });

  return (
    <main className="max-w-4xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Pending Comments</h1>

      {comments.map((c) => (
        <div key={c.id} className="border p-4 mb-4">
          <p className="font-semibold">{c.user.name}</p>
          <p className="text-sm text-gray-500">{c.post.title}</p>
          <p className="mt-2">{c.content}</p>
        </div>
      ))}
    </main>
  );
}
