import connectDB from "@/lib/connectDB";
import Package from "@/models/Admin/Package";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        await connectDB();
        const { slug } = await params; // No need for "await" here

        if (!slug) {
            return NextResponse.json({ error: "Invalid request, slug is required" }, { status: 400 });
        }

        const packageData = await Package.findOne({ slug });

        if (!packageData) {
            return NextResponse.json({ error: "Package not found" }, { status: 404 });
        }
        return NextResponse.json(packageData, { status: 200 });
    } catch (error) {
        console.error("Error fetching package:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
