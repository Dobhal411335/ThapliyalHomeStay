import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import BannerSection2nd from "@/models/Admin/BannerSection2nd";
import { deleteFileFromCloudinary } from "@/utils/cloudinary/index";


export async function GET(req) {
    await connectDB();
    try {
        const banners = await BannerSection2nd.find({}).sort({ createdAt: -1 });
        return NextResponse.json(banners, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 });
    }
}

export async function POST(req) {
    await connectDB();
    try {
        const { buttonLink, image, mobileImage } = await req.json();

        const newBanner = new BannerSection2nd({ buttonLink, image, mobileImage });
        await newBanner.save();
        return NextResponse.json(newBanner, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: `Failed to create banner: ${error.message}` }, { status: 500 });
    }
}

export async function PATCH(req) {
    await connectDB();
    try {
        const { id, buttonLink, image, mobileImage } = await req.json();
        const updateData = {};
        if (buttonLink !== undefined) updateData.buttonLink = buttonLink;
        if (image !== undefined) updateData.image = image;
        if (mobileImage !== undefined) updateData.mobileImage = mobileImage;

        const updatedBanner = await BannerSection2nd.findByIdAndUpdate(id, updateData, { new: true });
        return NextResponse.json(updatedBanner, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update banner" }, { status: 500 });
    }
}

export async function DELETE(req) {
    await connectDB();
    try {
        const { id } = await req.json();

        // Find the banner first
        const banner = await BannerSection2nd.findById(id);
        if (!banner) {
            return NextResponse.json({ error: "Banner not found" }, { status: 404 });
        }

        // Delete the image from Uploadthing (if key exists)
        if (banner.image?.key) {
            await deleteFileFromCloudinary(banner.image.key);
        }
        if (banner.mobileImage?.key) {
            await deleteFileFromCloudinary(banner.mobileImage.key);
        }

        // Delete banner from database
        await BannerSection2nd.findByIdAndDelete(id);

        return NextResponse.json({ message: "Banner deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: `Failed to delete banner: ${error.message}` }, { status: 500 });
    }
}
