import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Hotel from "@/models/Admin/Hotel";
import RoomPrice from "@/models/Admin/RoomPrice";

function json(success, message, data = null, status = 200) {
  return NextResponse.json({ success, message, data }, { status });
}

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const product = searchParams.get("product") || searchParams.get("room");

    if (!product) {
      return json(false, "Room id is required.", null, 400);
    }

    const priceDoc = await RoomPrice.findOne({ room: product }).lean();
    return NextResponse.json(priceDoc || { prices: [] }, { status: 200 });
  } catch (error) {
    return json(false, error.message || "Failed to fetch prices.", null, 500);
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const roomId = body?.room;
    const prices = Array.isArray(body?.prices) ? body.prices : [];

    if (!roomId) {
      return json(false, "Room id is required.", null, 400);
    }

    const room = await Hotel.findById(roomId);
    if (!room) {
      return json(false, "Room not found.", null, 404);
    }

    const normalized = prices
      .filter((item) => item?.type)
      .map((item) => ({
        type: item.type,
        amount: Number(item.amount) || 0,
        oldPrice: Number(item.oldPrice) || 0,
        cgst: Number(item.cgst) || 0,
        sgst: Number(item.sgst) || 0,
      }));

    const priceDoc = await RoomPrice.findOneAndUpdate(
      { room: roomId },
      { room: roomId, prices: normalized },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    if (!room.prices?.some((id) => String(id) === String(priceDoc._id))) {
      room.prices = [priceDoc._id];
      await room.save();
    }

    return json(true, "Room price saved.", priceDoc, 200);
  } catch (error) {
    return json(false, error.message || "Failed to save price.", null, 500);
  }
}
