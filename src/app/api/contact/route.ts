import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { db } from "@/lib/db";

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

    // Save to Database so it shows up in Admin Panel (/admin/contact)
    await db.contactMessage.create({
      data: {
        name,
        email,
        subject,
        message,
      },
    });

    // Attempt to send email if SMTP credentials are fully configured
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || "smtp.gmail.com",
          port: Number(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_SECURE === "true",
          auth: {
            user: process.env.SMTP_USER, 
            pass: process.env.SMTP_PASS, 
          },
        });

        const dateStr = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

        await transporter.sendMail({
          from: `"Chatmi AI Support" <${process.env.SMTP_USER}>`,
          to: "supportchatmiai@gmail.com",
          replyTo: email,
          subject: `[Contact Form] ${subject}`,
          text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nDate: ${dateStr}\nIP: ${ip}\n\nMessage:\n${message}`,
          html: `
            <div style="font-family: 'Google Sans', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #f9f9f9;">
              <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 40px 30px; text-align: center;">
                <div style="font-size: 24px; font-weight: 400; color: #202124; margin-bottom: 24px;">
                  New Contact Submission
                </div>
                
                <div style="display: inline-flex; align-items: center; justify-content: center; background-color: #f1f3f4; padding: 6px 16px; border-radius: 16px; margin-bottom: 24px;">
                  <span style="font-size: 14px; color: #3c4043; font-weight: 500;">${email}</span>
                </div>

                <p style="font-size: 16px; color: #3c4043; line-height: 1.5; margin-bottom: 32px; text-align: left;">
                  You received a new message from <strong>${name}</strong> regarding <strong>${subject}</strong>.
                </p>

                <div style="text-align: left; background-color: #f8f9fa; border-radius: 8px; padding: 16px; margin-bottom: 32px; border: 1px solid #f1f3f4;">
                  <p style="margin: 0; font-size: 14px; color: #3c4043; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                </div>

                <a href="mailto:${email}" style="display: inline-block; background-color: #1a73e8; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 500; padding: 10px 24px; border-radius: 18px; margin-bottom: 16px;">
                  Reply to ${name}
                </a>

                <p style="font-size: 12px; color: #5f6368; line-height: 1.4; margin-bottom: 0;">
                  IP Address: ${ip} <br/>
                  Received: ${dateStr}
                </p>
              </div>
            </div>
          `,
        });
      } catch (emailErr) {
        console.warn("SMTP email notification failed, but message was saved to DB:", emailErr);
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error in contact form API:", error);
    return NextResponse.json(
      { error: "Failed to process contact message. Please try again later." },
      { status: 500 }
    );
  }
}
