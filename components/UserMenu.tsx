"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";

export default function UserMenu() {
  const { data: session } = useSession();
  const user = session?.user;

  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const name = user?.name || user?.email?.split("@")[0] || "User";
  const image = user?.image;

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 200); // 1 sec delay
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className="flex items-center gap-3 focus:outline-none">
        {image ? (
          <div className="relative">
            <Image
              src={image}
              alt={name}
              width={40}
              height={40}
              className="rounded-full ring-2 ring-purple-500/40 transition-all duration-300"
            />
            <div className="absolute inset-0 rounded-full bg-linear-to-r from-cyan-500/20 to-purple-600/20 opacity-0 transition-opacity duration-500" />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-linear-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold ring-2 ring-purple-500/40 transition-all">
            {name[0]?.toUpperCase()}
          </div>
        )}
        <span className="hidden sm:block text-sm font-medium text-gray-200 transition-colors">
          {name}
        </span>
      </button>

      {/* Dropdown */}
      <div
        className={`absolute right-0 mt-3 w-64 bg-gray-900/95 backdrop-blur-lg border border-gray-800 rounded-xl shadow-2xl shadow-purple-500/20 transition-all duration-500 ${
          open
            ? "opacity-100 visible translate-y-0 pointer-events-auto"
            : "opacity-0 invisible translate-y-2 pointer-events-none"
        }`}
      >
        <div className="py-3 px-4 border-b border-gray-800">
          <p className="text-sm font-medium text-white">{name}</p>
          <p className="text-xs text-gray-400 truncate">{user?.email}</p>
        </div>
        <div className="py-2">
          <DropdownItem href="/dashboard">Dashboard</DropdownItem>
          <DropdownItem href="/dashboard/new">Write Post</DropdownItem>
          {user?.role === "ADMIN" && (
            <>
              <DropdownItem href="/admin/contact">
                Contact Messages
              </DropdownItem>
              <DropdownItem href="/admin">Admin</DropdownItem>
            </>
          )}
        </div>
        <div className="py-2 border-t border-gray-800">
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full px-4 py-2 text-left text-sm text-red-400 hover:text-red-300 hover:bg-gray-800/50 transition-colors"
          >
            Sign out
          </button>
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
