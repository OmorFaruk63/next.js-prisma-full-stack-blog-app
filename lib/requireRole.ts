import { getCurrentUser } from "./auth";

export async function requireRole(role: "ADMIN" | "AUTHOR") {
  const user = await getCurrentUser();

  if (!user || user.role !== role) {
    throw new Error("Forbidden");
  }

  return user;
}
