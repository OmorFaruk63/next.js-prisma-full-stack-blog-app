// app/layout.tsx
import Header from "../components/Header";
import "./globals.css";
import Providers from "./providers";

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
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
