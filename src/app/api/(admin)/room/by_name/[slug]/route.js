import connectDB from "@/lib/connectDB";
import Hotel from "@/models/Admin/Hotel";
import "@/models/Admin/Room";
import "@/models/Admin/RoomAmenities";
import "@/models/Admin/RoomPrice";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { slug } = await params;
    const room = await Hotel.findOne({ slug, listingType: "room" })
      .populate("amenities")
      .populate("prices")
      .populate("rooms")
      .lean();

    if (!room) {
      return new Response(JSON.stringify({ error: "Room not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(room), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
