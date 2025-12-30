// app/dashboard/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPostPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    content: "",
    published: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create post");
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
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-indigo-950 to-gray-950 pt-4 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-linear-to-r from-cyan-400 via-purple-500 to-pink-500 animate-pulse-slow">
            Create New Post
          </h1>
          <p className="mt-3 text-gray-400">
            Share your vision with the future
          </p>
        </div>

        {/* Form Card */}
        <div className="relative bg-gray-900/40 backdrop-blur-xl border border-gray-800/70 rounded-2xl p-8 shadow-2xl shadow-purple-900/20">
          {/* Subtle animated background */}
          <div className="absolute inset-0 bg-linear-to-r from-cyan-900/8 via-purple-900/8 to-pink-900/8 pointer-events-none" />

          <form onSubmit={handleSubmit} className="relative space-y-6 z-10">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Post Title
              </label>
              <input
                type="text"
                placeholder="Enter a striking title..."
                className="
                  w-full px-5 py-3.5 bg-gray-900/60 border border-gray-700 rounded-xl
                  text-gray-100 placeholder-gray-500
                  focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20
                  transition-all duration-300
                "
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            {/* Content - Rich textarea with better UX */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Content (Markdown supported)
              </label>
              <textarea
                placeholder="Whisper to the machine... What reality will you weave?"
                className="
                  w-full px-5 py-4 bg-gray-900/60 border border-gray-700 rounded-xl
                  text-gray-100 placeholder-gray-500 min-h-[320px] resize-y
                  focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20
                  transition-all duration-300 font-mono text-sm
                "
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                required
              />
            </div>

            {/* Publish Toggle + Submit */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-4 border-t border-gray-800/50">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={form.published}
                    onChange={(e) =>
                      setForm({ ...form, published: e.target.checked })
                    }
                  />
                  <div
                    className={`
                      w-14 h-7 rounded-full transition-all duration-300
                      ${
                        form.published
                          ? "bg-linear-to-r from-cyan-500 to-purple-600"
                          : "bg-gray-700"
                      }
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
                  disabled={isSubmitting || !form.title.trim()}
                  className="
                    px-8 py-3 bg-linear-to-r from-cyan-600 to-purple-600
                    hover:from-cyan-500 hover:to-purple-500
                    text-white font-medium rounded-xl
                    shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50
                    transition-all duration-300 disabled:opacity-50
                    flex items-center gap-2 cursor-pointer
                  "
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                      Saving...
                    </>
                  ) : (
                    "Create Post"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Quick Tips */}
        <div className="mt-10 text-center text-sm text-gray-500">
          <p>
            Markdown supported • Preview coming soon •
            <span className="text-cyan-400">
              {" "}
              Write something that inspires the future
            </span>
          </p>
        </div>
      </div>
    </main>
  );
}
