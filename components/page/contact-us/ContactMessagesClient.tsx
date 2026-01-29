// app/admin/contact/ContactMessagesClient.tsx
"use client";

import { useState } from "react";
import { format } from "date-fns";

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  createdAt: Date;
};

type Props = {
  initialMessages: ContactMessage[];
};

export default function ContactMessagesClient({ initialMessages }: Props) {
  const [messages, setMessages] = useState(initialMessages);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null,
  );
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleOpenReply = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    setReplyText(
      `Hello ${msg.name},\n\nThank you for contacting us! ...\n\nBest regards,\nOmor faruk \nFuture Blog Team`,
    );
    setFeedback(null);
  };

  const tableHead = ["Sender", "Email", "Message", "Date", "Status", "Actions"];

  const handleCloseReply = () => {
    setSelectedMessage(null);
    setReplyText("");
    setFeedback(null);
  };

  const handleSendReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;

    setIsSending(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/contact/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId: selectedMessage.id,
          to: selectedMessage.email,
          subject: `Re: Your message to Future Blog`,
          body: replyText,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send reply");
      }

      // Update local state
      setMessages((prev) =>
        prev.map((m) =>
          m.id === selectedMessage.id ? { ...m, status: "REPLIED" } : m,
        ),
      );

      setFeedback({ type: "success", text: "Reply sent successfully!" });
      setTimeout(() => {
        handleCloseReply();
      }, 2000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFeedback({
          type: "error",
          text: err.message || "Something went wrong",
        });
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleMarkReplied = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/contact/${id}/mark-replied`, {
        method: "POST",
      });

      if (!res.ok) throw new Error("Failed to update status");

      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: "REPLIED" } : m)),
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-gray-800 bg-gray-900/40 backdrop-blur-xl">
        <table className="min-w-full divide-y divide-gray-800">
          <thead className="bg-gray-950/60">
            <tr>
              {tableHead.map((head) => (
                <th
                  key={head}
                  className="px-6 py-4 text-left text-sm font-semibold text-cyan-300"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {messages.map((msg) => (
              <tr
                key={msg.id}
                className="hover:bg-gray-800/40 transition-colors"
              >
                <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-200">
                  {msg.name}
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-300">
                  {msg.email}
                </td>
                <td className="px-6 py-5 text-sm text-gray-300 max-w-md truncate">
                  {msg.message.substring(0, 120)}
                  {msg.message.length > 120 ? "..." : ""}
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-400">
                  {format(new Date(msg.createdAt), "MMM d, yyyy • HH:mm")}
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <span
                    className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                      msg.status === "PENDING"
                        ? "bg-yellow-900/60 text-yellow-300 border border-yellow-700/60"
                        : msg.status === "REPLIED"
                          ? "bg-green-900/60 text-green-300 border border-green-700/60"
                          : "bg-gray-800 text-gray-400"
                    }`}
                  >
                    {msg.status}
                  </span>
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-right text-sm space-x-3">
                  {msg.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => handleOpenReply(msg)}
                        className="text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        Reply
                      </button>
                      <button
                        onClick={() => handleMarkReplied(msg.id)}
                        className="text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        Mark Replied
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reply Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900/90 backdrop-blur-xl border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-cyan-300 mb-6">
                Reply to {selectedMessage.name}
              </h2>

              <div className="mb-6 p-4 bg-gray-800/60 rounded-xl">
                <p className="text-sm text-gray-400">To:</p>
                <p className="text-gray-200">{selectedMessage.email}</p>
                <p className="text-sm text-gray-400 mt-3">Original message:</p>
                <p className="text-gray-300 mt-1 whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </div>

              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={8}
                className="w-full px-5 py-3.5 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 resize-none"
                placeholder="Type your reply here..."
              />

              {feedback && (
                <div
                  className={`mt-4 p-3 rounded-xl text-center ${
                    feedback.type === "success"
                      ? "bg-green-900/50 border border-green-700/60 text-green-300"
                      : "bg-red-900/50 border border-red-700/60 text-red-300"
                  }`}
                >
                  {feedback.text}
                </div>
              )}

              <div className="mt-8 flex justify-end gap-4">
                <button
                  onClick={handleCloseReply}
                  className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendReply}
                  disabled={isSending || !replyText.trim()}
                  className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white rounded-xl shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isSending ? (
                    <>
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Sending...
                    </>
                  ) : (
                    "Send Reply"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
