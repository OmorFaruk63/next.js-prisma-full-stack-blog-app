// app/layout.tsx
import UnderConstructionToast from "@/components/UnderConstructionToast";
import Header from "../components/Header";
import "./globals.css";
import Providers from "./providers";
import { SpeedInsights } from "@vercel/speed-insights/next";
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
        <UnderConstructionToast />
        <SpeedInsights />
      </body>
    </html>
  );
}
