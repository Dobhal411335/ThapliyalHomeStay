import connectDB from "@/lib/connectDB";
import Hotel from "@/models/Admin/Hotel";
import "@/models/Admin/RoomAmenities";
import "@/models/Admin/RoomPrice";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { slug } = await params;
    const room = await Hotel.findOne({ slug })
      .populate("amenities")
      .populate("prices")
      .lean();

    if (!room) {
      return new Response(JSON.stringify({ error: "Hotel not found" }), {
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
