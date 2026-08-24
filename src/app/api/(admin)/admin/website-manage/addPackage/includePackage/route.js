import connectDB from "@/lib/connectDB";
import { NextResponse } from "next/server";
import Package from "@/models/Admin/Package";

export async function POST(req) {
    await connectDB();
    const body = await req.json();

    try {
        if (!body.pkgId || !body.includePackage) {
            return NextResponse.json(
                { message: "Package ID and include package data are required" },
                { status: 400 }
            );
        }

        const updatedPackage = await Package.findByIdAndUpdate(
            body.pkgId,
            { $push: { includePackage: body.includePackage } },
            { new: true }
        );

        if (!updatedPackage) {
            return NextResponse.json(
                { message: "Package not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Include package added successfully!", package: updatedPackage },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error adding include package:", error);
        return NextResponse.json(
            { message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function PATCH(req) {
    await connectDB();

    try {
        const body = await req.json();

        if (!body.pkgId || !body.includePackage || !body.includePackage._id) {
            return NextResponse.json(
                { message: "Package ID and Include Package ID are required" },
                { status: 400 }
            );
        }

        const existingPackage = await Package.findById(body.pkgId);
        if (!existingPackage) {
            return NextResponse.json(
                { message: "Package not found" },
                { status: 404 }
            );
        }

        // Find the specific includePackage item and update only that
        const updatedPackage = await Package.findOneAndUpdate(
            { _id: body.pkgId, "includePackage._id": body.includePackage._id },
            { $set: { "includePackage.$": body.includePackage } },
            { new: true }
        );

        if (!updatedPackage) {
            return NextResponse.json(
                { message: "Include package entry not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Include package updated successfully!", package: updatedPackage },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating include package:", error);
        return NextResponse.json(
            { message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function DELETE(req) {
    await connectDB();

    try {
        const { pkgId, includePackageId } = await req.json();

        if (!pkgId || !includePackageId) {
            return NextResponse.json(
                { message: "Package ID and Include Package ID are required" },
                { status: 400 }
            );
        }

        const deletedPackage = await Package.findByIdAndUpdate(
            pkgId,
            { $pull: { includePackage: { _id: includePackageId } } },
            { new: true }
        );

        if (!deletedPackage) {
            return NextResponse.json(
                { message: "Package not found!" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Include package deleted successfully!" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting include package:", error);
        return NextResponse.json(
            { message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
