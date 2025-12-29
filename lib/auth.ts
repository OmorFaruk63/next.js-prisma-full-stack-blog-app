import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// lib/getCurrentUser.ts
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
    },
  });

  return user;
}
