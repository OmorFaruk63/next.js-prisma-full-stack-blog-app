"use client";

export default function Error({ error }: { error: Error }) {
  return (
    <div className="h-screen flex items-center justify-center">
      <div>
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="text-gray-600">{error.message}</p>
      </div>
    </div>
  );
}
