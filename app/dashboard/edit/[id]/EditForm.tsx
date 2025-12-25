"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditForm({ id }: { id: string }) {
  const router = useRouter();
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then((r) => r.json())
      .then(setForm);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch(`/api/posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) return alert("Update failed");

    router.push("/dashboard");
  }

  if (!form) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        value={form.title}
        className="w-full border p-2"
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <textarea
        value={form.content}
        className="w-full border p-2 h-40"
        onChange={(e) => setForm({ ...form, content: e.target.value })}
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.published}
          onChange={(e) => setForm({ ...form, published: e.target.checked })}
        />
        Published
      </label>

      <button className="bg-black text-white px-4 py-2 rounded">Update</button>
    </form>
  );
}
