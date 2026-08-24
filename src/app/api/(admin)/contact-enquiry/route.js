import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import ContactEnquiry from "@/models/Enquries/ContactEnquiry";

function json(success, message, data = null, status = 200) {
  return NextResponse.json({ success, message, data }, { status });
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim().toLowerCase();
    const countryCode = String(body?.countryCode || "").trim();
    const phone = String(body?.phone || "").trim();
    const guests = String(body?.guests || "").trim();

    if (!name || !email || !countryCode || !phone || !guests) {
      return json(false, "Name, email, country code, phone, and guests are required.", null, 400);
    }

    if (name.length < 2) {
      return json(false, "Please enter your name.", null, 400);
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json(false, "Please enter a valid email.", null, 400);
    }

    if (!/^\+\d{1,4}$/.test(countryCode)) {
      return json(false, "Please select a valid country code.", null, 400);
    }

    if (!/^\d{10,15}$/.test(phone)) {
      return json(false, "Please enter a valid phone number (10–15 digits).", null, 400);
    }

    const enquiry = await ContactEnquiry.create({
      name,
      email,
      countryCode,
      phone,
      guests,
      plan: String(body?.plan || "").trim(),
      startDate: String(body?.startDate || "").trim(),
      hopes: String(body?.hopes || "").trim(),
      status: "Pending",
    });

    return json(true, "Enquiry submitted successfully.", enquiry, 201);
  } catch (error) {
    return json(
      false,
      error.message || "Failed to submit enquiry.",
      null,
      500
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const enquiries = await ContactEnquiry.find({})
      .sort({ createdAt: -1 })
      .lean();
    return json(true, "Contact enquiries fetched.", enquiries, 200);
  } catch (error) {
    return json(
      false,
      error.message || "Failed to fetch enquiries.",
      null,
      500
    );
  }
}

export async function PATCH(req) {
  try {
    await connectDB();
    const body = await req.json();
    const id = body?.id;
    const status = body?.status;

    if (!id || !status) {
      return json(false, "Enquiry id and status are required.", null, 400);
    }

    if (!["Pending", "Contacted", "Closed"].includes(status)) {
      return json(false, "Invalid status.", null, 400);
    }

    const enquiry = await ContactEnquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).lean();

    if (!enquiry) {
      return json(false, "Enquiry not found.", null, 404);
    }

    return json(true, "Enquiry status updated.", enquiry, 200);
  } catch (error) {
    return json(
      false,
      error.message || "Failed to update enquiry.",
      null,
      500
    );
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    const body = await req.json();
    const id = body?.id;

    if (!id) {
      return json(false, "Enquiry id is required.", null, 400);
    }

    const deleted = await ContactEnquiry.findByIdAndDelete(id);

    if (!deleted) {
      return json(false, "Enquiry not found.", null, 404);
    }

    return json(true, "Enquiry deleted.", null, 200);
  } catch (error) {
    return json(
      false,
      error.message || "Failed to delete enquiry.",
      null,
      500
    );
  }
}
