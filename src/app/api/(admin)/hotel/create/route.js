import connectDB from "@/lib/connectDB";
import Hotel from "@/models/Admin/Hotel";
import Room from "@/models/Admin/Room";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { hotelId, rooms } = body;

    if (!hotelId || !Array.isArray(rooms)) {
      return new Response(
        JSON.stringify({ error: "Missing hotelId or rooms array" }),
        { status: 400 }
      );
    }

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return new Response(
        JSON.stringify({ error: "Hotel not found" }),
        { status: 404 }
      );
    }

    const roomIdsToSave = [];

    // Create or update each room and attach hotelId
    for (const roomData of rooms) {
      const {
        _id,
        title,
        name,
        code,
        slug,
        titleLine,
        keywords,
        paragraph,
        mainPhoto,
        relatedPhotos,
        singleOccupancyPrice,
        doubleOccupancyPrice,
        amenities
      } = roomData;

      if (_id) {
        // Update existing room
        const updated = await Room.findByIdAndUpdate(_id, {
          title,
          name,
          titleLine,
          keywords,
          paragraph,
          mainPhoto,
          relatedPhotos,
          singleOccupancyPrice,
          doubleOccupancyPrice,
          amenities,
        });
        roomIdsToSave.push(_id);
      } else {
        // Create new room
        const room = await Room.create({
          title,
          name,
          code: code || slug || Math.random().toString(36).substring(7),
          slug: slug || Math.random().toString(36).substring(7),
          titleLine,
          keywords,
          paragraph,
          mainPhoto,
          relatedPhotos,
          singleOccupancyPrice,
          doubleOccupancyPrice,
          amenities,
          hotelId
        });
        roomIdsToSave.push(room._id.toString());
      }
    }

    // Identify rooms that were removed and delete them from the database
    const currentRoomIds = hotel.rooms.map(id => id.toString());
    const roomsToDelete = currentRoomIds.filter(id => !roomIdsToSave.includes(id));
    if (roomsToDelete.length > 0) {
      await Room.deleteMany({ _id: { $in: roomsToDelete } });
    }

    // Set hotel.rooms to exactly the saved rooms
    hotel.rooms = roomIdsToSave;
    await hotel.save();

    return new Response(JSON.stringify({ message: "Rooms saved successfully", rooms: roomIdsToSave }), { status: 201 });
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
    const hotelId = searchParams.get("hotelId");

    if (!hotelId) {
      return new Response(
        JSON.stringify({ error: "Missing hotelId parameter" }),
        { status: 400 }
      );
    }

    const hotel = await Hotel.findById(hotelId).populate("rooms");
    
    if (!hotel) {
      return new Response(
        JSON.stringify({ error: "Hotel not found" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify({ hotel }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
