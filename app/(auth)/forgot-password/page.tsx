"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        return;
      }

      setMessage("If an account exists, you'll receive a reset link shortly.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Network error. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-indigo-950 to-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="relative bg-gray-900/40 backdrop-blur-xl border border-gray-800/70 rounded-2xl p-8 shadow-2xl shadow-purple-900/20">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-purple-900/10 to-pink-900/10 opacity-60 pointer-events-none" />

          <div className="relative z-10">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-linear-to-r from-cyan-400 via-purple-500 to-pink-500 animate-pulse-slow">
                Reset Password
              </h1>
              <p className="mt-3 text-gray-400">
                Enter your email to receive a reset link
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="email"
                placeholder="Your email address"
                className="
                  w-full px-5 py-3.5 bg-gray-900/60 border border-gray-700 rounded-xl
                  text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 transition-all
                "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {error && (
                <div className="text-red-400 text-sm text-center bg-red-950/30 border border-red-900/50 rounded-lg py-2 px-4">
                  {error}
                </div>
              )}

              {message && (
                <div className="text-cyan-400 text-sm text-center bg-cyan-950/30 border border-cyan-900/50 rounded-lg py-3 px-4">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="
                  w-full py-3.5 px-6 bg-linear-to-r from-cyan-600 to-purple-600
                  hover:from-cyan-500 hover:to-purple-500 text-white font-medium rounded-xl
                  shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300
                  disabled:opacity-60 flex items-center justify-center gap-2
                "
              >
                {loading ? (
                  <>
                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-500">
              <Link
                href="/login"
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                ← Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
