import DeleteBtn from "@/app/components/DeleteBtn";
import Link from "next/link";

async function getMyPosts() {
  const res = await fetch("http://localhost:3000/api/posts", {
    cache: "no-store",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
}

type data = {
  id: number;
  title: string;
  slug: string;
  createdAt: string;
  published: boolean;
  author: {
    name: string;
  };
};

export default async function DashboardPage() {
  const posts: data[] = await getMyPosts();
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
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post: data) => (
            <tr key={post.id}>
              <td className="border p-2">{post.title}</td>
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
          ))}
        </tbody>
      </table>
    </main>
  );
}
