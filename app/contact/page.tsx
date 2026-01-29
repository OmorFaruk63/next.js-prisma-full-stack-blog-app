// app/contact/page.tsx

import ContactForm from "@/components/page/contact-us/ContactForm";
import Link from "next/link";

export const metadata = {
  title: "Contact Us | Future Blog",
  description:
    "Get in touch with the Future Blog team. Send us your questions, feedback, or ideas.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-gray-950 via-indigo-950 to-gray-950 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        {/* Glass Card */}
        <div className="relative bg-gray-900/40 backdrop-blur-xl border border-gray-800/70 rounded-2xl p-8 md:p-10 shadow-2xl shadow-purple-900/20 overflow-hidden">
          {/* Animated subtle gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-r from-cyan-900/10 via-purple-900/10 to-pink-900/10 opacity-60 pointer-events-none" />

          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-linear-to-r from-cyan-400 via-purple-500 to-pink-500 animate-pulse-slow">
                Contact Us
              </h1>
              <p className="mt-4 text-gray-300 text-lg">
                Have a question, suggestion, or just want to say hi? Drop us a
                message.
              </p>
            </div>

            <ContactForm />

            {/* Footer */}
            <p className="mt-8 text-center text-sm text-gray-500">
              We&apos;ll reply as soon as possible.{" "}
              <Link
                href="/"
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Back to home
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
