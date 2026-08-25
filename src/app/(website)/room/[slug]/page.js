import connectDB from "@/lib/connectDB";
import Hotel from "@/models/Admin/Hotel";
import "@/models/Admin/Room";
import "@/models/Admin/RoomAmenities";
import "@/models/Admin/RoomPrice";
import SingelRoomDetail from "@/components/website/room/SingelRoomDetail.jsx";

function serializeData(data) {
  if (!data) return null;
  return JSON.parse(JSON.stringify(data));
}

async function getRoomBySlug(slug) {
  try {
    await connectDB();
    const room = await Hotel.findOne({
      slug,
      listingType: "room",
    })
      .populate("rooms")
      .populate("amenities")
      .populate("prices")
      .lean();
    return serializeData(room);
  } catch (error) {
    console.error("Failed to fetch room:", error);
    return null;
  }
}

async function getRelatedRooms(currentRoom, limit = 5) {
  if (!currentRoom?._id) return [];
  try {
    await connectDB();
    const related = await Hotel.find({
      _id: { $ne: currentRoom._id },
      listingType: "room",
      active: true,
    })
      .populate("rooms")
      .populate("amenities")
      .populate("prices")
      .limit(limit)
      .lean();
    return serializeData(related) || [];
  } catch (error) {
    console.error("Failed to fetch related rooms:", error);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const room = await getRoomBySlug(slug);
  const keywords = Array.isArray(room?.keywords)
    ? room.keywords.filter(Boolean)
    : [];

  return {
    title: room?.titleLine || room?.title || "Room",
    description: room?.heading || "",
    ...(keywords.length > 0 ? { keywords } : {}),
  };
}

export default async function RoomPage({ params }) {
  const { slug } = await params;
  const room = await getRoomBySlug(slug);

  if (!room) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-3xl flex-col items-center justify-center px-4 text-center">
        <h1 className="font-heading text-3xl text-heading">Room not found</h1>
        <p className="mt-2 font-body text-sm text-muted">
          This room is unavailable or the link may be incorrect.
        </p>
      </div>
    );
  }

  const relatedRooms = await getRelatedRooms(room, 5);

  return <SingelRoomDetail data={room} relatedRooms={relatedRooms} />;
}
