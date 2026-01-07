// app/api/auth/[...nextauth]/route.ts
import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Adapter } from "next-auth/adapters";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/sendVerificationEmail";
import { rateLimit } from "@/lib/rateLimit";

const MAX_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutes

export const authOptions = {
  adapter: PrismaAdapter(prisma as any) as Adapter,

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  providers: [
    // 🔐 GOOGLE
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // 🔐 EMAIL / PASSWORD
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Missing credentials");
        }

        const email = credentials.email.toLowerCase();

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          throw new Error("Invalid email or password");
        }

        // 🔒 Account locked
        if (user.lockedUntil && user.lockedUntil > new Date()) {
          throw new Error("ACCOUNT_LOCKED");
        }

        // 🚨 EMAIL NOT VERIFIED → AUTO SEND EMAIL + REDIRECT
        if (!user.emailVerified) {
          // Rate limit resend
          if (rateLimit(`verify:${email}`, 2, 60_000)) {
            await prisma.verificationToken.deleteMany({
              where: { identifier: email },
            });

            const token = crypto.randomBytes(32).toString("hex");
            const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

            await prisma.verificationToken.create({
              data: {
                identifier: email,
                token,
                expires,
              },
            });

            const verificationUrl = `${
              process.env.NEXT_PUBLIC_APP_URL
            }/api/auth/verify-email?token=${token}&email=${encodeURIComponent(
              email
            )}`;

            await sendVerificationEmail({
              to: email,
              name: user.name || "there",
              verificationUrl,
            });
          }

          throw new Error("EMAIL_NOT_VERIFIED");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          const failed = user.failedLoginCount + 1;

          await prisma.user.update({
            where: { id: user.id },
            data: {
              failedLoginCount: failed,
              lockedUntil:
                failed >= MAX_ATTEMPTS
                  ? new Date(Date.now() + LOCK_TIME)
                  : null,
            },
          });
          throw new Error("Invalid email or password");
        }
        // ✅ Reset counters on success
        await prisma.user.update({
          where: { id: user.id },
          data: {
            failedLoginCount: 0,
            lockedUntil: null,
          },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
          include: { accounts: true },
        });

        if (existingUser && !existingUser.accounts.length) {
          // Link Google account to existing user
          await prisma.account.create({
            data: {
              userId: existingUser.id,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              type: account.type,
              access_token: account.access_token,
              refresh_token: account.refresh_token,
              expires_at: account.expires_at,
              id_token: account.id_token,
            },
          });
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
} satisfies NextAuthOptions;

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
