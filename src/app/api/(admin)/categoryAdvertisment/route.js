import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import CategoryAdvertisment from "@/models/Admin/CategoryAdvertisment";
import { deleteFileFromCloudinary } from "@/utils/cloudinary";

export async function GET(req) {
    await connectDB()
    try {
        const banners = await CategoryAdvertisment.find({}).sort({ createdAt: -1 });
        return NextResponse.json(banners, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch Category Advertisment Banner" }, { status: 500 });
    }
}

export async function POST(req) {
        await connectDB()
    try {
        const { buttonLink, image} = await req.json();

        const newBanner = new CategoryAdvertisment({  buttonLink, image});
        await newBanner.save();
        return NextResponse.json(newBanner, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: `Failed to create Category Advertisment Banner: ${error.message}` }, { status: 500 });
    }
}

export async function PATCH(req) {
        await connectDB()
    try {
        const { id, buttonLink, image } = await req.json();
        const updateData = {};
        if (buttonLink !== undefined) updateData.buttonLink = buttonLink;
        if (image !== undefined) updateData.image = image;

        const updatedBanner = await CategoryAdvertisment.findByIdAndUpdate(id, updateData, { new: true });
        return NextResponse.json(updatedBanner, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update Category Advertisment Banner" }, { status: 500 });
    }
}

export async function DELETE(req) {
        await connectDB()
    try {
        const { id } = await req.json();

        // Find the banner first
        const banner = await CategoryAdvertisment.findById(id);
        if (!banner) {
            return NextResponse.json({ error: "Category Advertisment Banner not found" }, { status: 404 });
        }

        // Delete the image from Uploadthing (if key exists)
        if (banner.image?.key) {
            await deleteFileFromCloudinary(banner.image.key);
        }

        // Delete banner from database
        await CategoryAdvertisment.findByIdAndDelete(id);

        return NextResponse.json({ message: "Category Advertisment Banner deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: `Failed to delete Category Advertisment Banner: ${error.message}` }, { status: 500 });
    }
}
