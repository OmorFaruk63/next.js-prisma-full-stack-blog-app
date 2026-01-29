// app/api/[...path]/route.ts
import { NextResponse } from "next/server";

export async function allMethods() {
  return NextResponse.json(
    {
      error: "Not Found",
      status: 404,
      message: "The requested API endpoint does not exist",
    },
    { status: 404 },
  );
}

// Export the same function for all supported methods
export const GET = allMethods;
export const POST = allMethods;
export const PUT = allMethods;
export const DELETE = allMethods;
export const PATCH = allMethods;
export const HEAD = allMethods;

// Optional: OPTIONS for CORS preflight (very common in development)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export const dynamic = "force-dynamic";
