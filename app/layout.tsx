// app/layout.tsx
import Header from "./components/Header";
import "./globals.css";

export const metadata = {
  title: "Next.js Prisma Full-Stack Blog",
  description: "Blog app with Next.js 15 + Prisma",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
