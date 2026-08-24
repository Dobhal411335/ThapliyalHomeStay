import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import HeroBanner from "@/models/Admin/HeroBanner";
import { deleteFileFromCloudinary } from "@/utils/cloudinary/index";
export async function GET(req) {
    await connectDB();
    try {
        const banners = await HeroBanner.find({}).sort({ createdAt: -1 });
        return NextResponse.json(banners, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 });
    }
}

export async function POST(req) {
    await connectDB();
    try {
        const { buttonLink, frontImg, mobileImg } = await req.json();

        const newBanner = new HeroBanner({
            buttonLink,
            frontImg,
            mobileImg,
        });
        await newBanner.save();
        return NextResponse.json(newBanner, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: `Failed to create banner: ${error.message}` }, { status: 500 });
    }
}

export async function PATCH(req) {
    await connectDB();
    try {
        const { id, buttonLink, frontImg, mobileImg } = await req.json();
        
        const updateData = {};
        if (buttonLink !== undefined) updateData.buttonLink = buttonLink;
        if (frontImg !== undefined) updateData.frontImg = frontImg;
        if (mobileImg !== undefined) updateData.mobileImg = mobileImg;

        const updatedBanner = await HeroBanner.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );
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
        const banner = await HeroBanner.findById(id);
        if (!banner) {
            return NextResponse.json({ error: "Banner not found" }, { status: 404 });
        }
        try {
            if (banner.frontImg?.key) {
                try {
                    await deleteFileFromCloudinary(banner.frontImg.key);
                } catch (cloudinaryError) {
                    console.error('Error deleting front image from Cloudinary:', cloudinaryError);
                }
            }

            if (banner.mobileImg?.key) {
                try {
                    await deleteFileFromCloudinary(banner.mobileImg.key);
                } catch (cloudinaryError) {
                    console.error('Error deleting mobile image from Cloudinary:', cloudinaryError);
                }
            }

            await HeroBanner.findByIdAndDelete(id);

            return NextResponse.json({ message: "Banner deleted successfully" }, { status: 200 });
        } catch (dbError) {
            console.error('Database error:', dbError);
            throw dbError;
        }
    } catch (error) {
        console.error('Error in DELETE /api/addBanner:', error);
        return NextResponse.json(
            { error: error.message || "Failed to delete banner" },
            { status: 500 }
        );
    }
}
