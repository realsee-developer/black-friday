import { NextResponse } from "next/server";
import type { ContactFormData } from "@/types";

export async function POST(request: Request) {
  try {
    const data: ContactFormData = await request.json();

    // Validate required fields
    if (
      !data.name ||
      !data.email ||
      !data.phone ||
      !data.industry ||
      !data.message
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Mock: Log the data (in production, you would send to CRM/Email service)
    console.log("Contact form submission:", {
      name: data.name,
      email: data.email,
      phone: `${data.countryCode} ${data.phone}`,
      country: data.country,
      companyName: data.companyName,
      industry: data.industry,
      message: data.message,
      devicesUsed: data.devicesUsed,
      timestamp: new Date().toISOString(),
    });

    // Mock: Simulate successful submission
    // In production, you would integrate with:
    // - SendGrid/Mailgun for email notifications
    // - HubSpot/Salesforce for CRM
    // - Database for storing submissions

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for your message. We will get back to you soon.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
