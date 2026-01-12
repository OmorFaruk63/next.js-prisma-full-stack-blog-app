// app/page.tsx
import PostGrid from "@/components/page/home/PostGrid";
import SearchForm from "@/components/page/home/SearchForm";
import Pagination from "@/components/Pagination";
import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { Suspense } from "react";

// Extract constants
const PAGE_SIZE = 6;

// Cached data fetching functions
const getCachedPosts = unstable_cache(
  async (page: number, search: string, sort: "latest" | "oldest") =>
    prisma.post.findMany({
      where: {
        published: true,
        title: { contains: search, mode: "insensitive" },
      },
      orderBy: { createdAt: sort === "latest" ? "desc" : "asc" },
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
  ["posts"],
  { tags: ["posts"], revalidate: 3600 } // revalidate every hour
);

const getCachedTotal = unstable_cache(
  async (search: string) =>
    prisma.post.count({
      where: {
        published: true,
        title: { contains: search, mode: "insensitive" },
      },
    }),
  ["post-count"],
  { tags: ["posts"], revalidate: 3600 }
);

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    sort?: "latest" | "oldest";
  }>;
}) {
  const params = await searchParams;
  const page = Number(params.page || 1);
  const search = params.search || "";
  const sort = params.sort || "latest";

  const [posts, total] = await Promise.all([
    getCachedPosts(page, search, sort),
    getCachedTotal(search),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <main className="min-h-screen bg-linear-to-b from-gray-950 via-indigo-950 to-gray-950 text-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-cyan-400 via-purple-500 to-pink-500 animate-pulse-slow">
            Future Blog
          </h1>
          <p className="mt-3 text-gray-400 text-lg">
            Discover tomorrow’s ideas today
          </p>
        </header>

        <SearchForm search={search} sort={sort} />

        <Suspense
          fallback={
            <div className="text-center py-20 text-gray-500">
              Loading posts...
            </div>
          }
        >
          <PostGrid posts={posts} />
        </Suspense>

        <Pagination
          page={page}
          totalPages={totalPages}
          search={search}
          sort={sort}
        />
      </div>
    </main>
  );
}
