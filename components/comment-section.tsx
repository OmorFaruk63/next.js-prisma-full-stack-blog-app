"use client";

import { useState } from "react";

type Comment = {
  id: number;
  content: string;
  postId: number;
  userId: number;
  parentId: null;
  approved: boolean;
  createdAt: string;
  user: {
    id: number;
    name: string;
    email: string;
    password: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
  replies: never[];
};

export default function CommentSection({
  postId,
  comments,
}: {
  postId: number;
  comments: any[];
}) {
  const [text, setText] = useState("");

  async function submitComment(parentId?: string) {
    await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, content: text, parentId }),
    });

    location.reload();
  }

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Comments</h2>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full border rounded p-2 mb-2"
        placeholder="Write a comment..."
      />

      <button
        onClick={() => submitComment()}
        className="bg-black text-white px-4 py-2 rounded mb-6"
      >
        Comment
      </button>

      <div className="space-y-4">
        {comments.map((c) => (
          <div key={c.id} className="border rounded p-3">
            <p className="font-medium">{c.user.name}</p>
            <p>{c.content}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
