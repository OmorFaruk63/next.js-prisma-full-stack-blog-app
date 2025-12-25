import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

export default async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="border-b">
      <div className="max-w-5xl mx-auto p-4 flex justify-between">
        <Link href="/" className="font-bold">
          MyBlog
        </Link>

        <nav className="space-x-4">
          {user ? (
            <>
              <span className="text-sm">Hi, {user.name}</span>
              <Link href="/dashboard">Dashboard</Link>
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
