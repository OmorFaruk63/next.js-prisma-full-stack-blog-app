// app/about/page.tsx
import Link from "next/link";

export const metadata = {
  title: "About Future Blog | NeoBlog",
  description:
    "A personal learning project built with Next.js 15, Prisma, PostgreSQL, and NextAuth — exploring modern full-stack development in a cyberpunk style.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-gray-950 via-indigo-950 to-gray-950 text-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        {/* Hero Section */}
        <header className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-cyan-400 via-purple-500 to-pink-500 animate-pulse-slow">
            About Future Blog
          </h1>
          <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
            A personal experiment in futuristic blogging — built from scratch to
            learn modern full-stack development.
          </p>
        </header>

        {/* Main Content - Glassmorphism Card */}
        <div className="grid gap-10 lg:grid-cols-5 items-start">
          <div className="lg:col-span-3">
            <div className="relative bg-gray-900/40 backdrop-blur-xl border border-gray-800/60 rounded-2xl p-8 md:p-10 shadow-2xl shadow-purple-900/20 hover:shadow-cyan-500/10 transition-all duration-500 group">
              {/* Subtle neon glow border on hover */}
              <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <div className="relative space-y-8 text-gray-200 leading-relaxed">
                <section>
                  <h2 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent mb-4">
                    What is Future Blog?
                  </h2>
                  <p>
                    Future Blog (aka NeoBlog) is my personal blog platform and
                    learning playground. It started as a way to deeply
                    understand modern Next.js patterns while building something
                    visually striking in a cyberpunk aesthetic.
                  </p>
                  <p className="mt-4">
                    The goal: create a clean, fast, beautiful blog with
                    authentication, comments, dashboard, and a
                    dark/neon/futuristic design — all while mastering backend +
                    frontend integration.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent mb-4">
                    Why this project?
                  </h2>
                  <p>
                    I&apos;m learning full-stack development hands-on. Instead
                    of following boring tutorials, I decided to build something
                    real, beautiful, and extensible.
                  </p>
                  <ul className="mt-4 space-y-3 pl-6 list-disc marker:text-cyan-400">
                    <li>
                      Master <strong>Next.js 15 App Router</strong> (Server
                      Components, Streaming, Suspense)
                    </li>
                    <li>
                      Learn <strong>Prisma ORM</strong> with PostgreSQL
                      (migrations, relations, nested comments)
                    </li>
                    <li>
                      Implement secure <strong>authentication</strong> with
                      NextAuth.js + custom flows
                    </li>
                    <li>
                      Practice optimistic UI updates (comments), caching, server
                      actions
                    </li>
                    <li>
                      Design a consistent <strong>cyberpunk theme</strong> using
                      Tailwind + glassmorphism + neon gradients
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-pink-300 to-cyan-300 bg-clip-text text-transparent mb-4">
                    Tech Stack
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                    {[
                      { name: "Next.js 15", color: "cyan" },
                      { name: "App Router", color: "cyan" },
                      { name: "Prisma", color: "purple" },
                      { name: "PostgreSQL", color: "purple" },
                      { name: "NextAuth.js", color: "pink" },
                      { name: "Tailwind CSS", color: "pink" },
                      { name: "TypeScript", color: "gray-300" },
                      { name: "Nodemailer", color: "gray-300" },
                    ].map((tech) => (
                      <div
                        key={tech.name}
                        className={`px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-center font-medium hover:border-${tech.color}-500/60 hover:bg-gray-800/70 transition-all duration-300`}
                      >
                        {tech.name}
                      </div>
                    ))}
                  </div>
                </section>

                <p className="text-lg italic text-gray-400 mt-10 border-l-4 border-purple-500/60 pl-5">
                  &quot;This is not just a blog — it&apos;s a living document of
                  my journey into modern web development.&quot;
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar / Quick facts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick stats glass cards */}
            <div className="bg-gray-900/50 backdrop-blur-lg border border-gray-800 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300">
              <h3 className="text-xl font-semibold text-purple-300 mb-4">
                Current Status
              </h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></span>
                  Authentication & Email flows — complete
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-purple-400 animate-pulse"></span>
                  Nested comments system — working
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-pink-400 animate-pulse"></span>
                  Dashboard + post CRUD — implemented
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-gray-500"></span>
                  Image upload, tags, admin panel — coming soon
                </li>
              </ul>
            </div>

            {/* Back to home */}
            <div className="text-center">
              <Link
                href="/"
                className="inline-block px-8 py-4 bg-linear-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/20 hover:shadow-cyan-500/30 transition-all duration-300 transform hover:-translate-y-1"
              >
                ← Back to the Future
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
