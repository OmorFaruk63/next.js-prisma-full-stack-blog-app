// lib/sendVerificationEmail.ts
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

export async function sendVerificationEmail({
  to,
  name,
  verificationUrl,
}: {
  to: string;
  name: string;
  verificationUrl: string;
}) {
  const message = {
    from: `"Blog App" <${process.env.GMAIL_USER}>`,
    to,
    subject: "Verify Your Email",
    html: `
      <h2>Hello ${name},</h2>
      <p>Click below to verify your email:</p>
      <a href="${verificationUrl}">Verify Email</a>
      <p>If that doesn't work, paste this into your browser:</p>
      <p>${verificationUrl}</p>
    `,
  };

  await transporter.sendMail(message);
}
