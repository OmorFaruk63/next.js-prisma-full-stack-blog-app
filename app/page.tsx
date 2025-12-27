import prisma from "@/lib/prisma";
import Link from "next/link";

type Props = {
  searchParams: {
    page?: string;
    search?: string;
    sort?: "latest" | "oldest";
  };
};

const PAGE_SIZE = 5;

export default async function HomePage({ searchParams }: Props) {
  const page = Number(searchParams.page || 1);
  const search = searchParams.search || "";
  const sort = searchParams.sort || "latest";

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: {
        published: true,
        title: { contains: search, mode: "insensitive" },
      },
      orderBy: {
        createdAt: sort === "latest" ? "desc" : "asc",
      },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        title: true,
        slug: true,
        createdAt: true,
        author: { select: { name: true } },
      },
    }),
    prisma.post.count({
      where: {
        published: true,
        title: { contains: search, mode: "insensitive" },
      },
    }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Blog</h1>

      {/* Search & Filter */}
      <form className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          name="search"
          defaultValue={search}
          placeholder="Search posts..."
          className="border px-3 py-2 rounded w-full"
        />

        <select
          name="sort"
          defaultValue={sort}
          className="border px-3 py-2 rounded"
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
        </select>

        <button className="bg-black text-white px-4 py-2 rounded">
          Search
        </button>
      </form>

      {/* Post List */}
      <div className="space-y-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <article
              key={post.id}
              className="border rounded p-4 hover:shadow transition"
            >
              <Link
                href={`/posts/${post.slug}`}
                className="text-xl font-semibold hover:underline"
              >
                {post.title}
              </Link>

              <p className="text-sm text-gray-500 mt-1">
                By {post.author.name} •{" "}
                {new Date(post.createdAt).toDateString()}
              </p>
            </article>
          ))
        ) : (
          <p>No posts found</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-10">
        {Array.from({ length: totalPages }).map((_, i) => (
          <Link
            key={i}
            href={`/?page=${i + 1}&search=${search}&sort=${sort}`}
            className={`px-3 py-1 border rounded ${
              page === i + 1 ? "bg-black text-white" : ""
            }`}
          >
            {i + 1}
          </Link>
        ))}
      </div>
    </main>
  );
}
