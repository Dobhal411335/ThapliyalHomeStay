import connectDB from "@/lib/connectDB";
import FilterBanner from "@/models/Admin/FilterBanner";
import { NextResponse } from "next/server";

// GET all filter banners
export async function GET() {
    await connectDB();
    try {
        const banners = await FilterBanner.find({}).sort({ createdAt: -1 });
        return NextResponse.json(banners);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch filter banners" }, { status: 500 });
    }
}

// POST - create a new filter banner
export async function POST(req) {
    await connectDB();
    try {
        const body = await req.json();
        const { image, buttonLink } = body;

        if (!image?.url) {
            return NextResponse.json({ error: "Image is required" }, { status: 400 });
        }

        const banner = new FilterBanner({ image, buttonLink });
        await banner.save();
        return NextResponse.json({ message: "Filter banner added successfully", banner });
    } catch (error) {
        return NextResponse.json({ error: "Failed to add filter banner" }, { status: 500 });
    }
}

// PATCH - update a filter banner
export async function PATCH(req) {
    await connectDB();
    try {
        const body = await req.json();
        const { id, image, buttonLink } = body;

        if (!id) {
            return NextResponse.json({ error: "Banner ID is required" }, { status: 400 });
        }

        const updated = await FilterBanner.findByIdAndUpdate(
            id,
            { image, buttonLink },
            { new: true }
        );

        if (!updated) {
            return NextResponse.json({ error: "Banner not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Filter banner updated successfully", banner: updated });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update filter banner" }, { status: 500 });
    }
}

// DELETE - delete a filter banner
export async function DELETE(req) {
    await connectDB();
    try {
        const body = await req.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json({ error: "Banner ID is required" }, { status: 400 });
        }

        const deleted = await FilterBanner.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json({ error: "Banner not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Filter banner deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete filter banner" }, { status: 500 });
    }
}
