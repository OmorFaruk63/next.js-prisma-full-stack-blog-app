// app/api/admin/contact/reply/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";
import { getCurrentUser } from "@/lib/auth";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { messageId, to, subject, body } = await req.json();

    if (!to || !subject || !body) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    await transporter.sendMail({
      from: `"Future Blog" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      replyTo: process.env.GMAIL_USER,
      text: body,
      html: `<div style="white-space: pre-wrap;">${body.replace(/\n/g, "<br>")}</div>`,
    });

    // Update status to REPLIED
    await prisma.contactMessage.update({
      where: { id: messageId },
      data: { status: "REPLIED" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("REPLY SEND ERROR:", error);
    return NextResponse.json(
      { message: "Failed to send reply" },
      { status: 500 },
    );
  }
}
