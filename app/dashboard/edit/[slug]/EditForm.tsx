"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  published: boolean;
};

type EditFormProps = {
  initialPost: Post;
};

export default function EditForm({ initialPost }: EditFormProps) {
  const router = useRouter();
  const [form, setForm] = useState(initialPost);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/posts/${initialPost.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          content: form.content,
          published: form.published,
          // slug: optional - if you want to allow changing slug
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update post");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative space-y-6 z-10">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Post Title
        </label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="
            w-full px-5 py-3.5 bg-gray-900/60 border border-gray-700 rounded-xl
            text-gray-100 placeholder-gray-500
            focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20
            transition-all duration-300
          "
          required
        />
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Content (Markdown supported)
        </label>
        <textarea
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="
            w-full px-5 py-4 bg-gray-900/60 border border-gray-700 rounded-xl
            text-gray-100 placeholder-gray-500 min-h-[400px] resize-y
            focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20
            transition-all duration-300 font-mono text-sm leading-relaxed
          "
          required
        />
      </div>

      {/* Published Toggle + Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-6 border-t border-gray-800/50">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) =>
                setForm({ ...form, published: e.target.checked })
              }
              className="sr-only"
            />
            <div
              className={`
                w-14 h-7 rounded-full transition-all duration-300
                ${form.published ? "bg-gradient-to-r from-cyan-500 to-purple-600" : "bg-gray-700"}
              `}
            />
            <div
              className={`
                absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-md transform transition-all duration-300
                ${form.published ? "translate-x-7" : "translate-x-0"}
              `}
            />
          </div>
          <span className="text-gray-300 group-hover:text-cyan-300 transition-colors">
            {form.published ? "Published" : "Draft"}
          </span>
        </label>

        <div className="flex items-center gap-4">
          {error && (
            <div className="text-red-400 text-sm bg-red-950/40 px-4 py-2 rounded-lg border border-red-900/50">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="
              px-8 py-3 bg-gradient-to-r from-cyan-600 to-purple-600
              hover:from-cyan-500 hover:to-purple-500
              text-white font-medium rounded-xl
              shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50
              transition-all duration-300 disabled:opacity-50
              flex items-center gap-2
            "
          >
            {loading ? (
              <>
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                Saving...
              </>
            ) : (
              "Update Post"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
