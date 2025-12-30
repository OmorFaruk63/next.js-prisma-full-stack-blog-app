// components/Header.tsx
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import UserMenu from "./UserMenu";

export default async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-gray-950/60 border-b border-gray-800/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-linear-to-r from-cyan-500 via-purple-600 to-pink-500 animate-pulse-slow" />
            <div className="absolute inset-0 rounded-full bg-linear-to-r from-cyan-400/40 via-purple-500/40 to-pink-400/40 blur-xl group-hover:blur-2xl transition-all duration-700" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-cyan-400 via-purple-500 to-pink-500 group-hover:from-cyan-300 group-hover:via-purple-400 group-hover:to-pink-400 transition-all duration-500">
            NeoBlog
          </span>
        </Link>

        {/* Navigation + Auth */}
        <div className="flex items-center gap-6 sm:gap-10">
          {/* Main nav - can be hidden on mobile or turned into menu */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink href="/posts">All Posts</NavLink>
            <NavLink href="/categories">Topics</NavLink>
            <NavLink href="/about">About</NavLink>
          </nav>

          {/* Auth area */}
          {user ? (
            <UserMenu />
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-cyan-300 hover:text-cyan-200 transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="px-5 py-2 bg-linear-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white text-sm font-medium rounded-lg shadow-md shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// Reusable glowing nav link
function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="relative text-gray-300 hover:text-cyan-300 text-sm font-medium transition-colors duration-300 group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-cyan-400 to-purple-500 group-hover:w-full transition-all duration-300" />
    </Link>
  );
}
