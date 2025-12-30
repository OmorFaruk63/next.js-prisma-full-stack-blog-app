"use client";

import { useState } from "react";

export default function CommentForm({ postId }: { postId: string }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    await fetch("/api/comments", {
      method: "POST",
      body: JSON.stringify({ postId, content }),
    });

    setContent("");
    setLoading(false);
    // Refresh or optimistic update
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add your comment"
        className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-500/60 min-h-[100px]"
      />
      <button
        type="submit"
        disabled={!content.trim() || loading}
        className="mt-3 px-6 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-xl disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send"}
      </button>
    </form>
  );
}
