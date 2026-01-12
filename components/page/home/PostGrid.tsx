import Link from "next/link";
import { format } from "date-fns"; // for better date formatting

type PostType = {
  posts: {
    id: string;
    slug: string;
    title: string;
    author: {
      name: string;
    };
    createdAt: Date;
  }[];
};

export default function PostGrid({ posts }: PostType) {
  return posts.length > 0 ? (
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
              <time dateTime={new Date(post.createdAt).toISOString()}>
                {format(new Date(post.createdAt), "MMM d, yyyy")}
              </time>
            </div>
          </Link>
          <div className="absolute inset-0 bg-linear-to-t from-cyan-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </article>
      ))}
    </div>
  ) : (
    <div className="text-center py-20 text-gray-500">
      <p className="text-xl">No posts found</p>
      <p className="mt-2">Try adjusting your search or filters</p>
    </div>
  );
}
