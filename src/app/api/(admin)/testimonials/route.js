import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Testimonial from "@/models/Admin/Testimonial";
import { deleteFileFromCloudinary } from "@/utils/cloudinary/index";

function json(success, message, data = null, status = 200) {
  return NextResponse.json({ success, message, data }, { status });
}

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get("active") === "true";

    const query = activeOnly ? { active: true } : {};

    const testimonials = await Testimonial.find(query)
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return json(true, "Testimonials fetched.", testimonials, 200);
  } catch (error) {
    return json(
      false,
      error.message || "Failed to fetch testimonials.",
      null,
      500
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const titleTag = String(body?.titleTag || "").trim();
    const date = body?.date ? new Date(body.date) : null;
    const title = String(body?.title || "").trim();
    const name = String(body?.name || "").trim();
    const location = String(body?.location || "").trim();
    const image = {
      url: String(body?.image?.url || "").trim(),
      key: String(body?.image?.key || "").trim(),
    };

    if (!title || !name || !location) {
      return json(
        false,
        "Title, name, and location are required.",
        null,
        400
      );
    }

    if (!image.url) {
      return json(false, "Please upload an image.", null, 400);
    }

    const lastItem = await Testimonial.findOne().sort({ order: -1 }).lean();
    const nextOrder = lastItem ? Number(lastItem.order || 0) + 1 : 1;

    const testimonial = await Testimonial.create({
      titleTag,
      date,
      title,
      name,
      location,
      image,
      active: body?.active !== false,
      order: nextOrder,
    });

    return json(true, "Testimonial created.", testimonial, 201);
  } catch (error) {
    return json(
      false,
      error.message || "Failed to create testimonial.",
      null,
      500
    );
  }
}

export async function PATCH(req) {
  try {
    await connectDB();
    const body = await req.json();
    const id = body?.id;

    if (!id) {
      return json(false, "Testimonial id is required.", null, 400);
    }

    const titleTag = String(body?.titleTag || "").trim();
    const date = body?.date ? new Date(body.date) : null;
    const title = String(body?.title || "").trim();
    const name = String(body?.name || "").trim();
    const location = String(body?.location || "").trim();
    const image = {
      url: String(body?.image?.url || "").trim(),
      key: String(body?.image?.key || "").trim(),
    };

    if (!title || !name || !location) {
      return json(
        false,
        "Title, name, and location are required.",
        null,
        400
      );
    }

    if (!image.url) {
      return json(false, "Please upload an image.", null, 400);
    }

    const update = {
      titleTag,
      date,
      title,
      name,
      location,
      image,
    };

    if (typeof body?.active === "boolean") {
      update.active = body.active;
    }

    if (body?.order != null && body.order !== "") {
      update.order = Number(body.order);
    }

    const testimonial = await Testimonial.findByIdAndUpdate(id, update, {
      new: true,
    });

    if (!testimonial) {
      return json(false, "Testimonial not found.", null, 404);
    }

    return json(true, "Testimonial updated.", testimonial, 200);
  } catch (error) {
    return json(
      false,
      error.message || "Failed to update testimonial.",
      null,
      500
    );
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    const body = await req.json();
    const id = body?.id;

    if (!id) {
      return json(false, "Testimonial id is required.", null, 400);
    }

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return json(false, "Testimonial not found.", null, 404);
    }

    if (testimonial.image?.key) {
      try {
        await deleteFileFromCloudinary(testimonial.image.key);
      } catch {
        /* continue deleting record even if cloudinary fails */
      }
    }

    await Testimonial.findByIdAndDelete(id);

    return json(true, "Testimonial deleted.", null, 200);
  } catch (error) {
    return json(
      false,
      error.message || "Failed to delete testimonial.",
      null,
      500
    );
  }
}
