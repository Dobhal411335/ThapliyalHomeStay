import connectDB from "@/lib/connectDB";
import { NextResponse } from "next/server";
import Package from "@/models/Admin/Package";

export async function POST(req) {
    await connectDB();
    const { pkgId, summary } = await req.json();

    try {
        const pkg = await Package.findById(pkgId);
        if (!pkg) {
            return NextResponse.json({ message: "Package not found" }, { status: 404 });
        }
        pkg.summary.push(summary);
        await pkg.save();
        return NextResponse.json({ message: "Summary added successfully" });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    await connectDB();
    const { pkgId, summary } = await req.json();

    try {
        const pkg = await Package.findById(pkgId);
        if (!pkg) {
            return NextResponse.json({ message: "Package not found" }, { status: 404 });
        }
        const index = pkg.summary.findIndex((s) => s._id.toString() === summary._id);
        if (index === -1) {
            return NextResponse.json({ message: "Summary not found" }, { status: 404 });
        }
        pkg.summary[index] = { ...pkg.summary[index], ...summary };
        await pkg.save();
        return NextResponse.json({ message: "Summary updated successfully" });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    await connectDB();
    const { pkgId, summaryId } = await req.json();

    try {
        const pkg = await Package.findById(pkgId);
        if (!pkg) {
            return NextResponse.json({ message: "Package not found" }, { status: 404 });
        }
        pkg.summary = pkg.summary.filter((s) => s._id.toString() !== summaryId);
        await pkg.save();
        return NextResponse.json({ message: "Summary deleted successfully" });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
