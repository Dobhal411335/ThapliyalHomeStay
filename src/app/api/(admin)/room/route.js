import connectDB from "@/lib/connectDB";
import Hotel from "@/models/Admin/Hotel";
import "@/models/Admin/Room";
import "@/models/Admin/RoomAmenities";
import "@/models/Admin/RoomPrice";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { title, code, slug, listingType, ...rest } = body;
    if (!title || !code || !slug) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }
    const room = await Hotel.create({
      title,
      code,
      slug,
      listingType: listingType === "room" ? "room" : "hotel",
      ...rest,
    });
    return new Response(JSON.stringify(room), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const listingType = searchParams.get("listingType");
    const filter =
      listingType === "room"
        ? { listingType: "room" }
        : { listingType: { $ne: "room" } };
    const rooms = await Hotel.find(filter)
      .populate("amenities")
      .populate("prices")
      .populate("rooms")
      .lean();
    return new Response(JSON.stringify({ rooms }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
