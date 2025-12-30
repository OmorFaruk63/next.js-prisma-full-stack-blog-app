// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ message: "No session" }, { status: 401 });

  // This is just informational; the real signout happens client-side
  return NextResponse.json({ message: "Logged out" });
}
