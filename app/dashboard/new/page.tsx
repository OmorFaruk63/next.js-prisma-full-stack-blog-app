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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) return alert("Failed");

    router.push("/dashboard");
  }

  return (
    <main className="max-w-3xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Create Post</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Title"
          className="w-full border p-2"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          placeholder="Content"
          className="w-full border p-2 h-40"
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
          />
          Publish now
        </label>

        <button className="bg-blue-950 text-white px-4 py-2 rounded">
          Save
        </button>
      </form>
    </main>
  );
}
