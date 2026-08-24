import connectDB from "@/lib/connectDB";
import Hotel from '@/models/Admin/Hotel';

export async function POST(req) {
  await connectDB();
  try {
    const { roomId, heading, paragraph, mainPhoto, relatedPhotos, titleLine, keywords } = await req.json();
    if (!roomId || !heading || !mainPhoto) {
      return Response.json({ error: 'Missing roomId, heading, or mainPhoto' }, { status: 400 });
    }

    const normalizedKeywords = Array.isArray(keywords)
      ? keywords.map((k) => (k || '').trim()).filter(Boolean)
      : [];

    const updatedRoom = await Hotel.findByIdAndUpdate(
      roomId,
      {
        heading,
        paragraph,
        mainPhoto,
        relatedPhotos,
        titleLine: typeof titleLine === 'string' ? titleLine.trim() : '',
        keywords: normalizedKeywords,
      },
      { new: true }
    );

    if (!updatedRoom) {
      return Response.json({ error: 'Hotel not found' }, { status: 404 });
    }

    return Response.json({ success: true, room: updatedRoom });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// GET: Get all info sections for a product
export async function GET(req) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get('roomId');
    if (!roomId) {
      return Response.json({ error: 'Missing roomId' }, { status: 400 });
    }
    const room = await Hotel.findOne({ _id: roomId });
    return Response.json({ room });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// PATCH: Update a section by index
export async function PATCH(req) {
  await connectDB();
  try {
    const { roomId, sectionIndex, title, description } = await req.json();
    if (!roomId || sectionIndex === undefined || !title || !description) {
      return Response.json({ error: 'Missing roomId, sectionIndex, title, or description' }, { status: 400 });
    }
    const room = await Hotel.findOne({ _id: roomId });
    if (!room) {
      return Response.json({ error: 'Hotel not found' }, { status: 404 });
    }
    room.heading = title;
    room.paragraph = description;
    await room.save();
    return Response.json({ success: true, heading: title, paragraph: description, room: room });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// DELETE: Remove a section by index
export async function DELETE(req) {
  await connectDB();
  try {
    const { roomId, sectionIndex } = await req.json();
    const index = Number(sectionIndex);
    if (!roomId || isNaN(index)) {
      return Response.json({ error: 'Missing roomId or sectionIndex' }, { status: 400 });
    }
    const room = await Hotel.findOne({ _id: roomId });
    room.heading = "";
    room.paragraph = "";
    await room.save();

 
    // console.log('After delete/save:', infoDoc.info);
    return Response.json({ success: true, heading: "", paragraph: "", room: room });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
