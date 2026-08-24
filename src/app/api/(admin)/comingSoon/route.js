import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import ComingSoon from "@/models/Admin/ComingSoon";
import { nanoid } from "nanoid";
import { deleteFileFromCloudinary } from "@/utils/cloudinary/index";

export async function POST(req) {
  try {
    await connectDB();
    const formData = await req.json();
    const { title, location, days, tourType, bannerUrl, thumbUrl, bannerKey, thumbKey } = formData;
    if (!title || !location || !days || !tourType || !bannerUrl || !thumbUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    // Generate a unique URL slug
    const slug = `${title.toLowerCase().replace(/\s+/g, "-")}-${nanoid(6)}`;
    const url = `/coming-soon/${slug}`;
    const comingSoon = await ComingSoon.create({
      title,
      location,
      days,
      tourType,
      bannerUrl,
      bannerKey,
      thumbUrl,
      thumbKey,
      url,
    });
    return NextResponse.json({ success: true, url, data: comingSoon });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectDB();
    const packages = await ComingSoon.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: packages });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// --- PATCH: Update a package ---
export async function PATCH(req) {
  try {
    await connectDB();
    const { id, ...updateFields } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Missing package id" }, { status: 400 });
    }
    const updated = await ComingSoon.findByIdAndUpdate(id, updateFields, { new: true });
    if (!updated) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// --- DELETE: Remove a package ---
export async function DELETE(req) {
  try {
    await connectDB();
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Missing package id" }, { status: 400 });
    }
    
    // Fetch package to get keys before deleting
    const packageToDelete = await ComingSoon.findById(id);
    if (!packageToDelete) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    const deleted = await ComingSoon.findByIdAndDelete(id);
    
    // Delete files from Cloudinary
    if (packageToDelete.bannerKey) {
        try {
            await deleteFileFromCloudinary(packageToDelete.bannerKey);
        } catch (e) {
            console.error("Failed to delete banner from Cloudinary", e);
        }
    }
    if (packageToDelete.thumbKey) {
        try {
            await deleteFileFromCloudinary(packageToDelete.thumbKey);
        } catch (e) {
            console.error("Failed to delete thumb from Cloudinary", e);
        }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}