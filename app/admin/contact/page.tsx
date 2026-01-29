// app/admin/contact/page.tsx
import ContactMessagesClient from "@/components/page/contact-us/ContactMessagesClient";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin - Contact Messages | Future Blog",
};

export default async function AdminContactPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const pendingCount = await prisma.contactMessage.count({
    where: { status: "PENDING" },
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-indigo-950 to-gray-950 text-gray-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 animate-pulse-slow">
            Contact Messages
          </h1>
          <p className="mt-3 text-gray-400 text-lg">
            {pendingCount} pending • Showing recent {messages.length} messages
          </p>
        </header>

        <ContactMessagesClient initialMessages={messages} />
      </div>
    </main>
  );
}
