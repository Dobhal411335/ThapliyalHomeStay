import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Hotel from "@/models/Admin/Hotel";
import "@/models/Admin/RoomAmenities";
import "@/models/Admin/RoomPrice";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    const currentRoom = await Hotel.findOne({ slug }).lean();
    if (!currentRoom) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
    }

    const relatedRooms = await Hotel.find({
      _id: { $ne: currentRoom._id },
      active: true,
    })
      .populate("amenities")
      .populate("prices")
      .lean();

    return NextResponse.json({ relatedRooms });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch related hotel" },
      { status: 500 }
    );
  }
}
