import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import RoomEnquiry from "@/models/Enquries/RoomEnquriy";
import "@/models/Admin/Hotel";
import "@/models/Admin/Room";

function json(success, message, data = null, status = 200) {
  return NextResponse.json({ success, message, data }, { status });
}

function createEnquiryId() {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `RM-${stamp}-${rand}`;
}

function serializeEnquiry(enquiry) {
  if (!enquiry) return null;
  const hotelRef =
    enquiry.hotelId && typeof enquiry.hotelId === "object"
      ? {
          _id: enquiry.hotelId._id?.toString?.() || String(enquiry.hotelId._id || ""),
          title: enquiry.hotelId.title || "",
          slug: enquiry.hotelId.slug || "",
          code: enquiry.hotelId.code || "",
        }
      : null;
  const roomRef =
    enquiry.roomId && typeof enquiry.roomId === "object"
      ? {
          _id: enquiry.roomId._id?.toString?.() || String(enquiry.roomId._id || ""),
          title: enquiry.roomId.title || "",
          slug: enquiry.roomId.slug || "",
          code: enquiry.roomId.code || "",
        }
      : null;

  return {
    ...enquiry,
    _id: enquiry._id?.toString?.() || String(enquiry._id),
    hotelId:
      hotelRef?._id ||
      enquiry.hotelId?.toString?.() ||
      String(enquiry.hotelId || ""),
    hotel: hotelRef,
    roomId:
      roomRef?._id ||
      enquiry.roomId?.toString?.() ||
      String(enquiry.roomId || ""),
    room: roomRef,
    arrival: enquiry.arrival
      ? new Date(enquiry.arrival).toISOString()
      : null,
    createdAt: enquiry.createdAt
      ? new Date(enquiry.createdAt).toISOString()
      : null,
    updatedAt: enquiry.updatedAt
      ? new Date(enquiry.updatedAt).toISOString()
      : null,
  };
}

export async function GET() {
  try {
    await connectDB();
    const enquiries = await RoomEnquiry.find({})
      .populate("hotelId", "title slug code")
      .populate("roomId", "title slug code")
      .sort({ createdAt: -1 })
      .lean();

    return json(
      true,
      "Hotel enquiries fetched.",
      enquiries.map(serializeEnquiry),
      200
    );
  } catch (error) {
    return json(
      false,
      error.message || "Failed to fetch Hotel enquiries.",
      null,
      500
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const hotelId = body?.hotelId;
    const hotelName = String(body?.hotelName || "").trim();
    const roomId = body?.roomId;
    const roomName = String(body?.roomName || "").trim();
    const firstName = String(body?.firstName || "").trim();
    const lastName = String(body?.lastName || "").trim();
    const email = String(body?.email || "").trim().toLowerCase();
    const countryCode = String(body?.countryCode || "+91").trim();
    const callNo = String(body?.callNo || "").trim();
    const address = String(body?.address || "").trim();
    const city = String(body?.city || "").trim();
    const district = String(body?.district || "").trim();
    const state = String(body?.state || "").trim();
    const arrival = body?.arrival ? new Date(body.arrival) : null;
    const roomNo = Number(body?.roomNo);
    const days = Number(body?.days);
    const adult = Number(body?.adult);

    if (!hotelId || !hotelName) {
      return json(false, "Hotel information is required.", null, 400);
    }
    if (!roomId || !roomName) {
      return json(false, "Room information is required.", null, 400);
    }
    if (!arrival || Number.isNaN(arrival.getTime())) {
      return json(false, "Arrival date is required.", null, 400);
    }
    if (!Number.isFinite(roomNo) || roomNo < 1) {
      return json(false, "Number of Hotels must be at least 1.", null, 400);
    }
    if (!Number.isFinite(days) || days < 1) {
      return json(false, "Number of days must be at least 1.", null, 400);
    }
    if (!firstName || !lastName) {
      return json(false, "First and last name are required.", null, 400);
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json(false, "Please enter a valid email.", null, 400);
    }
    if (!callNo) {
      return json(false, "Phone number is required.", null, 400);
    }
    if (!address || !city || !district || !state) {
      return json(false, "Complete address is required.", null, 400);
    }
    if (!Number.isFinite(adult) || adult < 1) {
      return json(false, "At least one adult is required.", null, 400);
    }

    const enquiry = await RoomEnquiry.create({
      hotelId,
      hotelName,
      roomId,
      roomName,
      roomSnapshot: {
        image: String(body?.roomSnapshot?.image || ""),
        code: String(body?.roomSnapshot?.code || ""),
        price:
          typeof body?.roomSnapshot?.price === "number"
            ? body.roomSnapshot.price
            : Number(body?.roomSnapshot?.price) || undefined,
      },
      enquiryId: createEnquiryId(),
      arrival,
      roomNo,
      days,
      firstName,
      lastName,
      email,
      countryCode,
      callNo,
      altCallNo: String(body?.altCallNo || "").trim(),
      address,
      city,
      district,
      state,
      adult,
      infant: Number(body?.infant) || 0,
      child: Number(body?.child) || 0,
      specialReq: String(body?.specialReq || "").trim(),
      offers: Array.isArray(body?.offers)
        ? body.offers.map((item) => String(item)).filter(Boolean)
        : [],
      estimatedAmount: Number(body?.estimatedAmount) || 0,
      status: "Pending",
    });

    return json(
      true,
      "Booking enquiry submitted successfully.",
      serializeEnquiry(enquiry.toObject()),
      201
    );
  } catch (error) {
    return json(
      false,
      error.message || "Failed to submit Hotel enquiry.",
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

    if (!["Pending", "Contacted", "Confirmed", "Closed"].includes(status)) {
      return json(false, "Invalid status.", null, 400);
    }

    const enquiry = await RoomEnquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).lean();

    if (!enquiry) {
      return json(false, "Enquiry not found.", null, 404);
    }

    return json(true, "Enquiry status updated.", serializeEnquiry(enquiry), 200);
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

    const deleted = await RoomEnquiry.findByIdAndDelete(id);
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
