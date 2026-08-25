import mongoose from "mongoose";
import connectDB from "@/lib/connectDB";
import Hotel from "@/models/Admin/Hotel";
import "@/models/Admin/Room";
import "@/models/Admin/RoomAmenities";
import "@/models/Admin/RoomPrice";

function json(data, status = 200) {
  return Response.json(data, { status });
}

function normalizeId(id) {
  if (Array.isArray(id)) return String(id[0] || "").trim();
  return String(id || "").trim();
}

export async function GET(req, { params }) {
  const id = normalizeId((await params).id);
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return json({ error: "Hotel ID is required" }, 400);
  }
  try {
    await connectDB();
    const room = await Hotel.findById(id)
      .populate("amenities")
      .populate("prices")
      .lean();
    if (!room) {
      return json({ error: "Hotel not found" }, 404);
    }
    return json(room);
  } catch (error) {
    return json({ error: error.message }, 500);
  }
}

export async function PUT(req, { params }) {
  const id = normalizeId((await params).id);
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return json({ error: "Hotel ID is required" }, 400);
  }
  try {
    await connectDB();
    const body = await req.json();
    const existing = await Hotel.findById(id);
    if (!existing) {
      return json({ error: "Hotel not found" }, 404);
    }

    const title =
      typeof body.title === "string" ? body.title.trim() : existing.title;
    const code =
      typeof body.code === "string" ? body.code.trim() : existing.code;
    const slug =
      typeof body.slug === "string" && body.slug.trim()
        ? body.slug.trim()
        : existing.slug;
    const listingType =
      body.listingType === "room" || body.listingType === "hotel"
        ? body.listingType
        : existing.listingType === "room"
          ? "room"
          : "hotel";
    const active =
      typeof body.active === "boolean" ? body.active : existing.active;

    if (!title || !code || !slug) {
      return json({ error: "Missing required fields" }, 400);
    }

    if (slug !== existing.slug) {
      const clash = await Hotel.findOne({
        slug,
        _id: { $ne: existing._id },
      }).lean();
      if (clash) {
        return json(
          { error: "A listing with this name already exists." },
          409
        );
      }
    }

    existing.title = title;
    existing.code = code;
    existing.slug = slug;
    existing.listingType = listingType;
    existing.active = active;
    await existing.save();

    return json(existing);
  } catch (error) {
    if (error?.code === 11000) {
      return json({ error: "A listing with this name already exists." }, 409);
    }
    return json({ error: error.message }, 500);
  }
}

export async function DELETE(req, { params }) {
  const id = normalizeId((await params).id);
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return json({ error: "Hotel ID is required" }, 400);
  }
  try {
    await connectDB();
    const deleted = await Hotel.findByIdAndDelete(id);
    if (!deleted) {
      return json({ error: "Hotel not found" }, 404);
    }
    return json({ message: "Hotel deleted successfully" });
  } catch (error) {
    return json({ error: error.message }, 500);
  }
}
