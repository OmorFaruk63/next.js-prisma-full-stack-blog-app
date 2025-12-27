import { cookies } from "next/headers";
import { verifyToken } from "./jwt";
import prisma from "./prisma";

export async function getCurrentUser() {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;

  try {
    const payload = verifyToken(token);

    return prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
  } catch {
    return null;
  }
}
