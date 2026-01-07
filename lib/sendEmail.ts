// lib/sendEmail.ts
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

export async function sendPasswordResetEmail({
  to,
  name,
  resetUrl,
}: {
  to: string;
  name: string;
  resetUrl: string;
}) {
  const message = {
    from: `"Blog" <${process.env.GMAIL_USER}>`,
    to,
    subject: "Reset Your Password",
    html: `
      <h2>Hello ${name},</h2>
      <p>You requested a password reset.</p>
      <p>Click the link below to set a new password:</p>
      <a href="${resetUrl}" style="color: #22d3ee; font-weight: bold;">Reset Password</a>
      <p>If you didn't request this, ignore this email.</p>
      <p>This link expires in 1 hour.</p>
      <p>Or paste: ${resetUrl}</p>
    `,
  };

  await transporter.sendMail(message);
}

// Keep your existing sendVerificationEmail function here too
