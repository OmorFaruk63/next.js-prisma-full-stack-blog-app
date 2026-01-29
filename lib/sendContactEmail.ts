// lib/sendContactEmail.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendContactEmail({
  fromName,
  fromEmail,
  message,
}: {
  fromName: string;
  fromEmail: string;
  message: string;
}) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    throw new Error("Email credentials not configured");
  }

  const ownerEmail = process.env.GMAIL_USER;

  const html = `
    <h2>New Contact Message from Future Blog</h2>
    <p><strong>From:</strong> ${fromName} (${fromEmail})</p>
    <p><strong>Message:</strong></p>
    <blockquote style="border-left: 4px solid #7c3aed; padding-left: 12px; margin: 12px 0;">
      ${message.replace(/\n/g, "<br>")}
    </blockquote>
    <p>Reply directly to: <a href="mailto:${fromEmail}">${fromEmail}</a></p>
    <hr>
    <p style="color: #6b7280; font-size: 0.9rem;">
      Sent via Future Blog Contact Form • ${new Date().toLocaleString()}
    </p>
  `;

  const mailOptions = {
    from: `"Future Blog Contact"`,
    to: "omor0173@gmail.com",
    replyTo: fromEmail,
    subject: `New Message from ${fromName}`,
    html,
    text: `From: ${fromName} (${fromEmail})\n\n${message}`,
  };

  await transporter.sendMail(mailOptions);
}
