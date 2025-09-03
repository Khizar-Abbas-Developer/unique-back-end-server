// emailService.js
import nodemailer from "nodemailer";
import "dotenv/config";

// Gmail SMTP Transporter (only email + password from .env)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Gmail SMTP host
  port: 465, // SSL port
  secure: true, // true because we are using port 465
  auth: {
    user: process.env.EMAIL_USER, // Gmail address
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});

// Send Contact Form Email
export const sendContactEmail = async (formData) => {
  const { firstName, lastName, email, contactNumber, message } = formData;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9fafb;">
      <h2 style="color:#2563eb;">📩 New Contact Form Submission</h2>
      <p><strong>First Name:</strong> ${firstName}</p>
      <p><strong>Last Name:</strong> ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Contact Number:</strong> ${contactNumber}</p>
      <p><strong>Message:</strong></p>
      <p style="background:#f3f4f6; padding:10px; border-radius:6px;">${message}</p>
      <hr/>
      <p style="font-size:12px; color:#6b7280;">
        This email was automatically sent from your website contact form.
      </p>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"OFMBase Contact" <${process.env.GMAIL_USER}>`, // Sender (your Gmail)
      to: "info@ofmbase.com", // Hardcoded admin email (replace if needed)
      subject: "New Contact Form Submission",
      html: htmlContent,
    });

    console.log("✅ Contact email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("❌ Failed to send contact email via Gmail SMTP:", err);
    throw err;
  }
};
