// components/page/contact-us/ContactForm.tsx
"use client";

import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to send message");
      }

      setStatus("success");
      setMessage("Message sent! We'll get back to you soon.");
      setForm({ name: "", email: "", message: "" }); // reset form
    } catch (err: unknown) {
      if (err instanceof Error) {
        setStatus("error");
        setMessage(err.message || "Something went wrong. Please try again.");
      } else {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    }
  }

  return (
    <>
      {/* Status Messages */}
      {status === "success" && (
        <div className="mb-6 p-4 bg-green-950/40 border border-green-800/60 rounded-xl text-green-300 text-center">
          {message}
        </div>
      )}
      {status === "error" && (
        <div className="mb-6 p-4 bg-red-950/40 border border-red-800/60 rounded-xl text-red-300 text-center">
          {message}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="text"
            placeholder="Your Name"
            className="w-full px-5 py-3.5 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div>
          <input
            type="email"
            placeholder="Your Email"
            className="w-full px-5 py-3.5 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>

        <div>
          <textarea
            placeholder="Your Message..."
            rows={5}
            className="w-full px-5 py-3.5 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 resize-none"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
          />
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className={`
                  w-full py-3.5 px-6
                  bg-gradient-to-r from-cyan-600 to-purple-600
                  hover:from-cyan-500 hover:to-purple-500
                  text-white font-medium rounded-xl
                  shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40
                  transition-all duration-300
                  disabled:opacity-60 disabled:cursor-not-allowed
                  flex items-center justify-center gap-2
                `}
        >
          {status === "loading" ? (
            <>
              <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
              Sending...
            </>
          ) : (
            "Send Message"
          )}
        </button>
      </form>
    </>
  );
}
