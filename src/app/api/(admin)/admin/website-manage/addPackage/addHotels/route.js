import connectDB from "@/lib/connectDB";
import { NextResponse } from "next/server";
import Package from "@/models/Admin/Package";

export async function POST(req) {
    await connectDB();
    const { pkgId, hotel } = await req.json();

    try {
        const pkg = await Package.findById(pkgId);
        if (!pkg) {
            return NextResponse.json({ message: "Package not found" }, { status: 404 });
        }
        pkg.hotels.push(hotel);
        await pkg.save();
        return NextResponse.json({ message: "Hotel added successfully" });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    await connectDB();
    const { pkgId, hotel } = await req.json();

    try {
        const pkg = await Package.findById(pkgId);
        if (!pkg) {
            return NextResponse.json({ message: "Package not found" }, { status: 404 });
        }
        const hotelIndex = pkg.hotels.findIndex((h) => h._id.toString() === hotel._id);
        if (hotelIndex === -1) {
            return NextResponse.json({ message: "Hotel not found" }, { status: 404 });
        }
        pkg.hotels[hotelIndex] = { ...pkg.hotels[hotelIndex], ...hotel };
        await pkg.save();
        return NextResponse.json({ message: "Hotel updated successfully" });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    await connectDB();
    const { pkgId, hotelId } = await req.json();

    try {
        const pkg = await Package.findById(pkgId);
        if (!pkg) {
            return NextResponse.json({ message: "Package not found" }, { status: 404 });
        }
        pkg.hotels = pkg.hotels.filter((h) => h._id.toString() !== hotelId);
        await pkg.save();
        return NextResponse.json({ message: "Hotel deleted successfully" });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
