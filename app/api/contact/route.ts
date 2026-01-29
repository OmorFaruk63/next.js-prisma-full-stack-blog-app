// app/api/contact/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendContactEmail } from "@/lib/sendContactEmail";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    }

    if (!email.includes("@") || !email.includes(".")) {
      return NextResponse.json({ message: "Invalid email" }, { status: 400 });
    }

    // Save to database FIRST (so we don't lose message if email fails)
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        message,
        status: "PENDING",
      },
    });

    // Then try to send email
    await sendContactEmail({
      fromName: name,
      fromEmail: email,
      message,
    });

    return NextResponse.json(
      {
        message: "Message received! We'll get back to you soon.",
        id: contactMessage.id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("CONTACT FORM ERROR:", error);
    return NextResponse.json(
      { message: "Failed to process message. Please try again later." },
      { status: 500 },
    );
  }
}
