// app/verify-email/page.tsx
import Link from "next/link";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; token?: string }>;
}) {
  const { email, token } = await searchParams;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-indigo-950 to-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="relative bg-gray-900/40 backdrop-blur-xl border border-gray-800/70 rounded-2xl p-10 shadow-2xl shadow-purple-900/20 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-purple-900/10 to-pink-900/10 opacity-60 pointer-events-none" />

          <div className="relative z-10">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-500 via-purple-600 to-pink-500 flex items-center justify-center animate-pulse-slow">
              <span className="text-3xl">✉️</span>
            </div>

            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 mb-4">
              {token ? "Email Verified!" : "Check Your Inbox"}
            </h1>

            {!token ? (
              <>
                <p className="text-gray-300 mb-6">
                  We sent a verification link to{" "}
                  <strong className="text-cyan-300">{email}</strong>
                </p>
                <p className="text-gray-400 text-sm mb-8">
                  Click the link in the email to activate your account.
                  <br />
                  Didn’t receive it? Check spam folder.
                </p>
              </>
            ) : (
              <>
                <p className="text-gray-300 mb-6">
                  Your email has been successfully verified!
                </p>
                <p className="text-gray-400 mb-8">
                  You can now sign in to your account.
                </p>
              </>
            )}

            <Link
              href="/login"
              className="inline-block px-8 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-medium rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300"
            >
              {token ? "Go to Login" : "Back to Login"}
            </Link>

            <p className="mt-8 text-sm text-gray-500">
              Need help?{" "}
              <Link
                href="/contact"
                className="text-cyan-400 hover:text-cyan-300"
              >
                Contact support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
