// app/dashboard/page.tsx
import DeleteBtn from "@/components/DeleteBtn";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { format } from "date-fns";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const checkAdmin = () => {
    if (user?.role === "ADMIN") {
      return {};
    }
    return { authorId: String(user.id) };
  };
  const posts = await prisma.post.findMany({
    where: checkAdmin(),
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      title: true,
      slug: true,
      createdAt: true,
      published: true,
    },
  });

  const totalPosts = await prisma.post.count({
    where: checkAdmin(),
  });

  const publishedCount = await prisma.post.count({
    where: { ...checkAdmin(), published: true },
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-indigo-950 to-gray-950 pt-4 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-linear-to-r from-cyan-400 via-purple-500 to-pink-500 animate-pulse-slow">
              Your Dashboard
            </h1>
            <p className="mt-2 text-gray-400 text-lg">
              Manage your thoughts • {format(new Date(), "MMMM d, yyyy")}
            </p>
          </div>

          <Link
            href="/dashboard/new"
            className="
              inline-flex items-center gap-2
              px-6 py-3 bg-linear-to-r from-cyan-600 to-purple-600
              hover:from-cyan-500 hover:to-purple-500
              text-white font-medium rounded-xl
              shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50
              transition-all duration-300 transform hover:-translate-y-0.5
            "
          >
            <span className="text-xl">+</span> New Post
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <StatCard
            title="Total Posts"
            value={totalPosts}
            icon="📝"
            color="from-cyan-500 to-cyan-600"
          />
          <StatCard
            title="Published"
            value={publishedCount}
            icon="🚀"
            color="from-purple-500 to-purple-600"
          />
          <StatCard
            title="Drafts"
            value={totalPosts - publishedCount}
            icon="📄"
            color="from-pink-500 to-pink-600"
          />
        </div>

        {/* Posts Table */}
        <div className="bg-gray-900/40 backdrop-blur-xl border border-gray-800/70 rounded-2xl shadow-2xl shadow-purple-900/20 overflow-hidden">
          <div className="p-6 border-b border-gray-800/50">
            <h2 className="text-2xl font-bold text-gray-100">Your Posts</h2>
          </div>

          {posts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800/50 bg-gray-950/50">
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {posts.map((post) => (
                    <tr
                      key={post.id}
                      className="hover:bg-gray-800/40 transition-colors duration-200 group"
                    >
                      <td className="px-6 py-4">
                        <div className="text-gray-100 font-medium group-hover:text-cyan-300 transition-colors">
                          <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {format(new Date(post.createdAt), "MMM d, yyyy")}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                            post.published
                              ? "bg-green-900/40 text-green-400 border border-green-800/50"
                              : "bg-amber-900/40 text-amber-400 border border-amber-800/50"
                          }`}
                        >
                          {post.published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-4">
                          <Link
                            href={`/dashboard/edit/${post.slug}`}
                            className="text-cyan-400 hover:text-cyan-300 transition-colors"
                          >
                            Edit
                          </Link>
                          <DeleteBtn slug={post.slug} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="text-gray-400 text-lg mb-4">No posts yet</p>
              <Link
                href="/dashboard/new"
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Create your first post →
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: string;
  color: string;
}) {
  return (
    <div
      className={`
        relative bg-linear-to-r ${color}/20 border border-${
        color.split("-")[1]
      }-800/50
        backdrop-blur-xl rounded-2xl p-6
        shadow-lg shadow-${color.split("-")[1]}-900/30
        hover:shadow-${color.split("-")[1]}-500/40
        transition-all duration-300 hover:-translate-y-1
      `}
    >
      <div className="text-4xl mb-3 opacity-80">{icon}</div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-gray-400">{title}</div>
    </div>
  );
}
