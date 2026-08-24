import connectDB from "@/lib/connectDB";
import Hotel from "@/models/Admin/Hotel";
import "@/models/Admin/Room";
import "@/models/Admin/RoomAmenities";
import "@/models/Admin/RoomPrice";
import RoomDetails from "@/components/website/room/RoomDetails.jsx";

function serializeData(data) {
  if (!data) return null;
  return JSON.parse(JSON.stringify(data));
}

async function getHotelBySlug(slug) {
  try {
    await connectDB();
    const hotel = await Hotel.findOne({ slug })
      .populate("rooms")
      .populate("amenities")
      .populate("prices")
      .lean();
    return serializeData(hotel);
  } catch (error) {
    console.error("Failed to fetch hotel:", error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const hotel = await getHotelBySlug(slug);
  const keywords = Array.isArray(hotel?.keywords)
    ? hotel.keywords.filter(Boolean)
    : [];

  return {
    title: hotel?.titleLine || hotel?.title || "Hotel",
    description: hotel?.heading || "",
    ...(keywords.length > 0 ? { keywords } : {}),
  };
}

export default async function HotelPage({ params }) {
  const { slug } = await params;
  const hotel = await getHotelBySlug(slug);

  if (!hotel) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-3xl flex-col items-center justify-center px-4 text-center">
        <h1 className="font-heading text-3xl text-heading">Hotel not found</h1>
        <p className="mt-2 font-body text-sm text-muted">
          This Hotel is unavailable or the link may be incorrect.
        </p>
      </div>
    );
  }

  return <RoomDetails data={hotel} />;
}
