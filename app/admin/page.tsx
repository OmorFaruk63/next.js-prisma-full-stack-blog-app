import DeleteBtn from "@/components/DeleteBtn";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return redirect("/");
  }
  const posts =
    (await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: { author: { select: { name: true } }, comments: true },
    })) || [];

  console.log(posts);

  return (
    <main className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">My Posts</h1>
      <a
        href="/dashboard/new"
        className="inline-block mb-4 bg-blue-950 text-white px-4 py-2  rounded"
      >
        + New Post
      </a>

      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">Title</th>
            <th className="border p-2">Author</th>
            <th className="border p-2">Comments</th>
            <th className="border p-2">Published</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.length > 0 ? (
            posts.map((post) => (
              <tr key={post.id}>
                <td className="border p-2">{post.title}</td>
                <td className="border p-2">{post.author.name}</td>
                <td className="border p-2">{post.comments.length}</td>
                <td className="border p-2">
                  {post.published ? "Published" : "Draft"}
                </td>
                <td className="border p-2">
                  <Link
                    href={`/dashboard/edit/${post.slug}`}
                    className="text-blue-600"
                  >
                    Edit
                  </Link>
                  <DeleteBtn slug={post.slug} />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="border p-2 text-center">
                No posts found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
}
