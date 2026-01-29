// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-linear-to-b from-gray-950 via-indigo-950 to-gray-950 flex items-center justify-center px-4 text-gray-100">
      <div className="text-center max-w-lg">
        <div className="relative inline-block mb-8">
          <h1 className="text-8xl md:text-9xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-linear-to-r from-cyan-400 via-purple-500 to-pink-500 animate-pulse-slow">
            404
          </h1>
          <div className="absolute inset-0 bg-linear-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-3xl opacity-50 -z-10" />
        </div>

        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-100">
          Page Not Found
        </h2>

        <p className="text-lg text-gray-400 mb-10">
          The page you&apos;re looking for seems to have vanished into the
          digital void.
          <br className="hidden sm:block" />
          Maybe it got lost in hyperspace?
        </p>

        <Link
          href="/"
          className="inline-block px-8 py-4 bg-linear-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1"
        >
          Return to Future
        </Link>

        <p className="mt-12 text-sm text-gray-500">
          Or maybe you&apos;re exploring uncharted routes... keep going!
        </p>
      </div>
    </main>
  );
}
