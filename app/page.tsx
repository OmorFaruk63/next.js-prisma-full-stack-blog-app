import prisma from "@/lib/prisma";
import Link from "next/link";

const PAGE_SIZE = 6; // slightly larger cards feel more modern

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    sort?: "latest" | "oldest";
  }>;
}) {
  const page = Number((await searchParams).page || 1);
  const search = (await searchParams).search || "";
  const sort = (await searchParams).sort || "latest";

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
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-indigo-950 to-gray-950 text-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {/* Header / Title */}
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-cyan-400 via-purple-500 to-pink-500 animate-pulse-slow">
            Future Blog
          </h1>
          <p className="mt-3 text-gray-400 text-lg">
            Discover tomorrow’s ideas today
          </p>
        </header>

        {/* Search & Filter */}
        <form className="flex flex-col sm:flex-row gap-4 mb-12 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <input
              name="search"
              defaultValue={search}
              placeholder="Search posts..."
              className="w-full px-5 py-3 bg-gray-900/60 backdrop-blur-md border border-gray-700 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all duration-300"
            />
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <select
            name="sort"
            defaultValue={sort}
            className="px-4 py-3 bg-gray-900/60 backdrop-blur-md border border-gray-700 rounded-xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 cursor-pointer"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>

          <button className="px-6 py-3 bg-linear-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-medium rounded-xl shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:shadow-cyan-500/40 cursor-pointer">
            Search
          </button>
        </form>

        {/* Post Grid */}
        {posts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group relative bg-gray-900/40 backdrop-blur-lg border border-gray-800 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10"
              >
                <Link href={`/posts/${post.slug}`} className="block p-6 h-full">
                  <h2 className="text-xl font-semibold text-gray-100 group-hover:text-cyan-400 transition-colors duration-300 line-clamp-2">
                    {post.title}
                  </h2>

                  <div className="mt-4 flex items-center gap-3 text-sm text-gray-400">
                    <span className="font-medium text-purple-400">
                      {post.author.name || "Anonymous"}
                    </span>
                    <span>•</span>
                    <time dateTime={post.createdAt.toISOString()}>
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                  </div>
                </Link>

                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl">No posts found</p>
            <p className="mt-2">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="flex justify-center gap-2 mt-12 flex-wrap">
            {Array.from({ length: totalPages }).map((_, i) => {
              const isActive = page === i + 1;
              return (
                <Link
                  key={i}
                  href={`/?page=${i + 1}&search=${encodeURIComponent(
                    search
                  )}&sort=${sort}`}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                    ${
                      isActive
                        ? "bg-cyan-600 text-white shadow-lg shadow-cyan-500/30"
                        : "bg-gray-800/60 text-gray-300 hover:bg-gray-700 hover:text-cyan-300 border border-gray-700"
                    }
                  `}
                >
                  {i + 1}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </main>
  );
}
