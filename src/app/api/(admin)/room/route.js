import connectDB from "@/lib/connectDB";
import Hotel from "@/models/Admin/Hotel.js";
import "@/models/Admin/RoomAmenities";
import "@/models/Admin/RoomPrice";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { title, code, slug, ...rest } = body;
    if (!title || !code || !slug) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }
    const room = await Hotel.create({ title, code, slug, ...rest });
    return new Response(JSON.stringify(room), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function GET() {
  try {
    await connectDB();
    const rooms = await Hotel.find({})
      .populate("amenities")
      .populate("prices")
      .lean();
    return new Response(JSON.stringify({ rooms }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
