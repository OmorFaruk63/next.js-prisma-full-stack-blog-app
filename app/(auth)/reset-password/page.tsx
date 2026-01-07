// app/(auth)/reset-password/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);

  useEffect(() => {
    if (!token || !email) {
      setError("Invalid or expired reset link");
      setValidating(false);
    } else {
      setValidating(false);
    }
  }, [token, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to reset password");
        return;
      }

      setMessage("Password reset successful! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2500);
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (validating)
    return (
      <div className="min-h-screen flex items-center justify-center text-cyan-400">
        Verifying...
      </div>
    );

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-indigo-950 to-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="relative bg-gray-900/40 backdrop-blur-xl border border-gray-800/70 rounded-2xl p-8 shadow-2xl shadow-purple-900/20">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-linear-to-r from-cyan-400 via-purple-500 to-pink-500">
              Set New Password
            </h1>
          </div>

          {error && (
            <div className="mb-6 text-red-400 text-center bg-red-950/30 border border-red-900/50 rounded-lg py-3 px-4">
              {error}
            </div>
          )}

          {message ? (
            <div className="text-cyan-400 text-center bg-cyan-950/30 border border-cyan-900/50 rounded-lg py-4 px-6">
              {message}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="password"
                placeholder="New Password"
                className="w-full px-5 py-3.5 bg-gray-900/60 border border-gray-700 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />

              <input
                type="password"
                placeholder="Confirm New Password"
                className="w-full px-5 py-3.5 bg-gray-900/60 border border-gray-700 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-linear-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-medium rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all disabled:opacity-60"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          <div className="mt-8 text-center text-sm text-gray-500">
            <Link href="/login" className="text-cyan-400 hover:text-cyan-300">
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
