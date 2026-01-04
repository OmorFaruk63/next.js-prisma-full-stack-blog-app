// app/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // app/register/page.tsx  (in handleSubmit)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.message || "Registration failed");
        return;
      }

      // Success → redirect to verification page
      if (result.redirect) {
        router.push(result.redirect);
      } else {
        router.push("/verify-email");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-indigo-950 to-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="relative bg-gray-900/40 backdrop-blur-xl border border-gray-800/70 rounded-2xl p-8 shadow-2xl shadow-purple-900/20 overflow-hidden">
          {/* Subtle animated gradient background */}
          <div className="absolute inset-0 bg-linear-to-r from-cyan-900/10 via-purple-900/10 to-pink-900/10 opacity-60 pointer-events-none" />

          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-linear-to-r from-cyan-400 via-purple-500 to-pink-500 animate-pulse-slow">
                Join Blog
              </h1>
              <p className="mt-3 text-gray-400">
                Create your account and start exploring tomorrow’s ideas
              </p>
            </div>

            {/* Google Button */}
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/" })}
              disabled={loading}
              className="
                w-full flex items-center justify-center gap-3
                bg-gray-800/70 hover:bg-gray-700/70
                border border-gray-700 rounded-xl
                py-3 px-4 text-gray-200 font-medium
                transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20
                disabled:opacity-50 disabled:cursor-not-allowed
                mb-6
              "
            >
              <FcGoogle className="text-2xl" />
              Sign up with Google
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-900/80 text-gray-500 backdrop-blur-sm">
                  or continue with email
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <input
                  type="text"
                  placeholder="Full Name"
                  className="
                    w-full px-5 py-3.5 bg-gray-900/50 border border-gray-700 rounded-xl
                    text-gray-200 placeholder-gray-500
                    focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20
                    transition-all duration-300
                  "
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="
                    w-full px-5 py-3.5 bg-gray-900/50 border border-gray-700 rounded-xl
                    text-gray-200 placeholder-gray-500
                    focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20
                    transition-all duration-300
                  "
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Password"
                  className="
                    w-full px-5 py-3.5 bg-gray-900/50 border border-gray-700 rounded-xl
                    text-gray-200 placeholder-gray-500
                    focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20
                    transition-all duration-300
                  "
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                />
              </div>

              {/* Error / Success Messages */}
              {error && (
                <div className="text-red-400 text-sm text-center bg-red-950/30 border border-red-900/50 rounded-lg py-2 px-4">
                  {error}
                </div>
              )}

              {success && (
                <div className="text-cyan-400 text-sm text-center bg-cyan-950/30 border border-cyan-900/50 rounded-lg py-2 px-4">
                  Account created! Check your email to verify → Redirecting...
                </div>
              )}

              <button
                type="submit"
                disabled={loading || success}
                className="
                  w-full py-3.5 px-6
                  bg-linear-to-r from-cyan-600 to-purple-600
                  hover:from-cyan-500 hover:to-purple-500
                  text-white font-medium rounded-xl
                  shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40
                  transition-all duration-300
                  disabled:opacity-60 disabled:cursor-not-allowed
                  flex items-center justify-center gap-2
                "
              >
                {loading ? (
                  <>
                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                    Creating...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            {/* Footer */}
            <p className="mt-8 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Sign in
              </Link>
            </p>

            <p className="mt-3 text-center text-xs text-gray-600">
              By signing up, you agree to our Terms • We’ll send a verification
              email
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
