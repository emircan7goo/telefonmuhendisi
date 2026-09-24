import nodemailer from "nodemailer";

// SMTP configurations loaded from environment variables (configured for GoDaddy)
const smtpHost = process.env.SMTP_HOST || "smtpout.secureserver.net";
const smtpPort = parseInt(process.env.SMTP_PORT || "465");
const smtpUser = process.env.SMTP_USER || "destek@telefonmuhendisi.com";
const smtpPass = process.env.SMTP_PASS || "";

export const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465, // true for 465, false for 587
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
  tls: {
    // Do not fail on invalid certificates (prevents ssl handshake issues)
    rejectUnauthorized: false,
  },
});

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  // If SMTP password is not set or is default placeholder, fallback to console logging in local environment
  if (!smtpPass || smtpPass.includes("sifreniz") || smtpPass.trim() === "") {
    console.log(`\n==================================================`);
    console.log(`[SMTP MOCK] to: ${to}`);
    console.log(`[SMTP MOCK] subject: ${subject}`);
    // Extract OTP code from HTML if present for easy viewing
    const otpMatch = html.match(/>(\d{6})</);
    if (otpMatch) {
      console.log(`[SMTP MOCK] OTP CODE: ${otpMatch[1]}`);
    }
    console.log(`==================================================\n`);
    return { success: true, messageId: "mock-message-id" };
  }

  const mailOptions = {
    from: `"Telefon Mühendisi" <${smtpUser}>`,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[SMTP] Email sent successfully: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("[SMTP] Error sending email:", error);
    return { success: false, error };
  }
}
