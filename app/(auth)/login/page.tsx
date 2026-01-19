"use client";
//app/(auth)/login/page.tsx
import { signIn } from "next-auth/react";
import { Suspense, use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";
export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const router = useRouter();

  const { callbackUrl } = use(searchParams);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "user@gmail.com",
    password: "123456",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (res?.error) {
        if (res.error === "EMAIL_NOT_VERIFIED") {
          router.push(`/verify-email?email=${encodeURIComponent(form.email)}`);
          return;
        }

        if (res.error === "ACCOUNT_LOCKED") {
          setError("Account locked. Try again later.");
          return;
        }

        setError("Invalid email or password");
        return;
      }

      // ✅ Success
      router.push(callbackUrl ? callbackUrl : "/");
      router.refresh();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || "Something went wrong. Try again.");
      } else {
        setError("Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Suspense>
      <main className="min-h-screen bg-gradient-to-b from-gray-950 via-indigo-950 to-gray-950 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="relative bg-gray-900/40 backdrop-blur-xl border border-gray-800/70 rounded-2xl p-8 shadow-2xl shadow-purple-900/20">
            {/* Background glow */}
            <div className="absolute inset-0 bg-linear-to-r from-cyan-900/10 via-purple-900/10 to-pink-900/10 opacity-60 pointer-events-none" />

            <div className="relative z-10">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-linear-to-r from-cyan-400 via-purple-500 to-pink-500 animate-pulse-slow">
                  Welcome Back
                </h1>
                <p className="mt-3 text-gray-400">
                  Sign in to continue your journey
                </p>
              </div>

              {/* Google Sign In */}
              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/" })}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-gray-800/70 hover:bg-gray-700/70 border border-gray-700 rounded-xl py-3 px-4 text-gray-200 font-medium transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 disabled:opacity-50 mb-6"
              >
                <FcGoogle className="text-2xl" />
                Continue with Google
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gray-900/80 text-gray-500 backdrop-blur-sm">
                    or sign in with email
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-5 py-3.5 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />

                {/* Password field with toggle */}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full px-5 py-3.5 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 pr-12"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none transition-colors"
                  >
                    {showPassword ? (
                      <FiEyeOff size={20} />
                    ) : (
                      <FiEye size={20} />
                    )}
                  </button>
                </div>

                {error && (
                  <div className="text-red-400 text-sm text-center bg-red-950/30 border border-red-900/50 rounded-lg py-2 px-4">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-medium rounded-xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  href="/forgot-password"
                  className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <p className="mt-8 text-center text-sm text-gray-500">
                Don’t have an account?{" "}
                <Link
                  href="/register"
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Create one now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </Suspense>
  );
}
