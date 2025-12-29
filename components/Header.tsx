// components/Header.tsx
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import Image from "next/image";

export default async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-gray-950/60 border-b border-gray-800/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 via-purple-600 to-pink-500 animate-pulse-slow" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400/40 via-purple-500/40 to-pink-400/40 blur-xl group-hover:blur-2xl transition-all duration-700" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 group-hover:from-cyan-300 group-hover:via-purple-400 group-hover:to-pink-400 transition-all duration-500">
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
            <UserMenu user={user} />
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
                className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white text-sm font-medium rounded-lg shadow-md shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300"
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
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 group-hover:w-full transition-all duration-300" />
    </Link>
  );
}

// User menu with avatar + dropdown trigger
function UserMenu({ user }) {
  const name = user.name || user.email?.split("@")[0] || "User";
  const image = user.image;

  return (
    <div className="relative group">
      <button className="flex items-center gap-3 focus:outline-none">
        {image ? (
          <div className="relative">
            <Image
              src={image}
              alt={name}
              width={40}
              height={40}
              className="rounded-full ring-2 ring-purple-500/40 group-hover:ring-purple-500/70 transition-all duration-300"
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold ring-2 ring-purple-500/40 group-hover:ring-purple-500/70 transition-all">
            {name[0]?.toUpperCase()}
          </div>
        )}
        <span className="hidden sm:block text-sm font-medium text-gray-200 group-hover:text-cyan-300 transition-colors">
          {name}
        </span>
      </button>

      {/* Dropdown - you can make it real with state + framer-motion or just show on hover for simplicity */}
      <div className="absolute right-0 mt-3 w-64 bg-gray-900/95 backdrop-blur-lg border border-gray-800 rounded-xl shadow-2xl shadow-purple-500/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-500 pointer-events-none group-hover:pointer-events-auto">
        <div className="py-3 px-4 border-b border-gray-800">
          <p className="text-sm font-medium text-white">{name}</p>
          <p className="text-xs text-gray-400 truncate">{user.email}</p>
        </div>
        <div className="py-2">
          <DropdownItem href="/profile">Profile</DropdownItem>
          <DropdownItem href="/posts/new">Write Post</DropdownItem>
          <DropdownItem href="/settings">Settings</DropdownItem>
        </div>
        <div className="py-2 border-t border-gray-800">
          <form action="/api/auth/signout" method="post">
            <button
              type="submit"
              className="w-full px-4 py-2 text-left text-sm text-red-400 hover:text-red-300 hover:bg-gray-800/50 transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function DropdownItem({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800/50 hover:text-cyan-300 transition-colors"
    >
      {children}
    </Link>
  );
}
