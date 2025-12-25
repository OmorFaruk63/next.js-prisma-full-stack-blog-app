"use client";
import { useRouter } from "next/navigation";

export default function DeleteBtn({ slug }: { slug: string }) {
  const router = useRouter();
  const deletePost = async () => {
    const res = await fetch(`/api/posts/${slug}`, {
      method: "DELETE",
    });
    console.log(res);

    if (!res.ok) throw new Error("Failed to delete post");
    router.refresh();
  };

  return (
    <button onClick={deletePost} className="ml-3 text-red-600 cursor-pointer">
      Delete
    </button>
  );
}
