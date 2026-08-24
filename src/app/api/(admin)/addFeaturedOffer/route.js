import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import FeaturedBanner from "@/models/Admin/FeaturedBanner";
import { deleteFileFromCloudinary } from "@/utils/cloudinary";


export async function GET(req) {
    await connectDB();
    try {
        const banners = await FeaturedBanner.find({}).sort({ createdAt: -1 });
        return NextResponse.json(banners, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch packages" }, { status: 500 });
    }
}

export async function POST(req) {
    await connectDB();
    try {
        const { propertyName, propertyType, propertySubDestination, price, buttonLink, image } = await req.json();

        const newBanner = new FeaturedBanner({ 
            propertyName, 
            propertyType, 
            propertySubDestination, 
            price, 
            buttonLink, 
            image,
        });
        await newBanner.save();
        return NextResponse.json(newBanner, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: `Failed to create packages: ${error.message}` }, { status: 500 });
    }
}

export async function PATCH(req) {
    await connectDB();
    try {
        const { id, propertyName, propertyType, propertySubDestination, price, buttonLink, image } = await req.json();
        
        const updateData = {};
        if (propertyName !== undefined) updateData.propertyName = propertyName;
        if (propertyType !== undefined) updateData.propertyType = propertyType;
        if (propertySubDestination !== undefined) updateData.propertySubDestination = propertySubDestination;
        if (price !== undefined) updateData.price = price;
        if (buttonLink !== undefined) updateData.buttonLink = buttonLink;
        if (image !== undefined) updateData.image = image;

        const updatedBanner = await FeaturedBanner.findByIdAndUpdate(id, updateData, { new: true });
        return NextResponse.json(updatedBanner, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update packages" }, { status: 500 });
    }
}

export async function DELETE(req) {
    await connectDB();
    try {
        const { id } = await req.json();

        // Find the banner first
        const banner = await FeaturedBanner.findById(id);
        if (!banner) {
            return NextResponse.json({ error: "packages not found" }, { status: 404 });
        }

        // Delete the image from Uploadthing (if key exists)
        if (banner.image?.key) {
            await deleteFileFromCloudinary(banner.image.key);
        }

        // Delete banner from database
        await FeaturedBanner.findByIdAndDelete(id);

        return NextResponse.json({ message: "packages deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: `Failed to delete packages: ${error.message}` }, { status: 500 });
    }
}
