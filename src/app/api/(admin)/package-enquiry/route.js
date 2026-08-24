import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import PackageEnquiry from "@/models/Enquries/PackageEnquiry";
import "@/models/Admin/Package";

function json(success, message, data = null, status = 200) {
  return NextResponse.json({ success, message, data }, { status });
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const packageId = body?.packageId;
    const packageName = String(body?.packageName || "").trim();
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim().toLowerCase();
    const countryCode = String(body?.countryCode || "").trim();
    const phone = String(body?.phone || "").trim();
    const guests = String(body?.guests || "").trim();

    if (!packageId || !packageName || !name || !email || !countryCode || !phone || !guests) {
      return json(
        false,
        "Package, name, email, country code, phone, and guests are required.",
        null,
        400
      );
    }

    if (!/^\+\d{1,4}$/.test(countryCode)) {
      return json(false, "Please select a valid country code.", null, 400);
    }

    if (!/^\d{10,15}$/.test(phone)) {
      return json(false, "Please enter a valid phone number (10–15 digits).", null, 400);
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      return json(false, "Please enter a valid email.", null, 400);
    }

    if (name.length < 2) {
      return json(false, "Please enter your name.", null, 400);
    }

    const enquiry = await PackageEnquiry.create({
      packageId,
      packageName,
      packageSnapshot: {
        image: String(body?.packageSnapshot?.image || ""),
        location: String(body?.packageSnapshot?.location || ""),
        duration:
          body?.packageSnapshot?.duration != null &&
          body?.packageSnapshot?.duration !== ""
            ? Number(body.packageSnapshot.duration)
            : undefined,
        tourType: String(body?.packageSnapshot?.tourType || ""),
        price:
          typeof body?.packageSnapshot?.price === "number"
            ? body.packageSnapshot.price
            : undefined,
        priceUnit: String(body?.packageSnapshot?.priceUnit || ""),
        doubleOccupancyPrice:
          typeof body?.packageSnapshot?.doubleOccupancyPrice === "number"
            ? body.packageSnapshot.doubleOccupancyPrice
            : 0,
      },
      name,
      email,
      countryCode,
      phone,
      guests,
      dates: String(body?.dates || "").trim(),
      experiences: Array.isArray(body?.experiences)
        ? body.experiences.map((item) => String(item)).filter(Boolean)
        : [],
      accommodation: String(body?.accommodation || "").trim(),
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

    const enquiries = await PackageEnquiry.find({})
      .populate("packageId", "packageName slug basicDetails price")
      .sort({ createdAt: -1 })
      .lean();

    return json(true, "Package enquiries fetched.", enquiries, 200);
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

    const enquiry = await PackageEnquiry.findByIdAndUpdate(
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

    const deleted = await PackageEnquiry.findByIdAndDelete(id);

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
