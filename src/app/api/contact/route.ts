import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Simple in-memory rate limiting map
// Keys are IP addresses, values are arrays of timestamps of recent requests
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 5;

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, subject, message } = data;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Get IP address for rate limiting and logging
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || 
               request.headers.get("x-real-ip") || 
               "Unknown IP";

    // Rate limiting
    const now = Date.now();
    let timestamps = rateLimitMap.get(ip) || [];
    timestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW);
    
    if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }
    
    timestamps.push(now);
    rateLimitMap.set(ip, timestamps);

    // Ensure SMTP credentials exist
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn("SMTP credentials not found in environment variables. Email will not be sent.");
      return NextResponse.json(
        { error: "Server is not configured to send emails currently." },
        { status: 500 }
      );
    }

    // Setup Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER, 
        pass: process.env.SMTP_PASS, 
      },
    });

    const dateStr = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

    // Send the email
    await transporter.sendMail({
      from: `"Chatmi AI Support" <${process.env.SMTP_USER}>`,
      to: "supportchatmiai@gmail.com",
      replyTo: email,
      subject: `[Contact Form] ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nDate: ${dateStr}\nIP: ${ip}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: sans-serif; max-w-2xl; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #5B21B6; margin-top: 0;">New Contact Form Submission</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Name:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${name}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Email:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Subject:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${subject}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Date (IST):</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${dateStr}</td></tr>
            <tr><td style="padding: 8px 0;"><strong>IP Address:</strong></td><td style="padding: 8px 0;">${ip}</td></tr>
          </table>
          <h3 style="color: #333; margin-bottom: 10px;">Message:</h3>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; white-space: pre-wrap; color: #444; line-height: 1.5;">${message}</div>
        </div>
      `,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error in contact form API:", error);
    return NextResponse.json(
      { error: "Failed to send email. Please try again later." },
      { status: 500 }
    );
  }
}
