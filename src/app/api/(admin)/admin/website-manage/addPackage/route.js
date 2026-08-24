import connectDB from "@/lib/connectDB";
import { NextResponse } from "next/server";
import Package from "@/models/Admin/Package";
import MenuBar from "@/models/Admin/MenuBar";
import { deleteFileFromCloudinary } from "@/utils/cloudinary/index";

const slugify = (str) => {
    if (!str) return "";
    return String(str)
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "");
};

const generateUniqueSlug = async (sourceName, excludeId = null) => {
    const baseSlug = slugify(sourceName);
    if (!baseSlug) return "";

    let slug = baseSlug;
    let suffix = 1;

    while (true) {
        const existingPackage = await Package.findOne({
            slug,
            ...(excludeId ? { _id: { $ne: excludeId } } : {}),
        });

        if (!existingPackage) return slug;

        slug = `${baseSlug}-${suffix}`;
        suffix += 1;
    }
};

export async function POST(req) {
    await connectDB();
    const body = await req.json();

    try {
        const sourceName = body?.packages?.packageName || body?.packages?.slug;
        const slug = await generateUniqueSlug(sourceName);

        if (!slug) {
            return NextResponse.json({ message: "Valid package name is required" }, { status: 400 });
        }

        // Step 1: Create a new Package document
        const newPackage = await Package.create({
            link: body.packages.link,
            order: body.packages.order,
            active: body.packages.active,
            packageCode: body.packages.packageCode,
            packageName: body.packages.packageName,
            slug,
            price: body.packages.price,
            priceUsd: body.packages.priceUsd || 0,
            doubleOccupancyPrice: body.packages.doubleOccupancyPrice || 0,
            doubleOccupancyPriceUsd: body.packages.doubleOccupancyPriceUsd || 0,
            priceUnit: body.packages.priceUnit
        });

        // Step 2: Find and update the corresponding subMenu item
        if (body.subMenuId) {
            await MenuBar.updateOne(
                { "subMenu._id": body.subMenuId },  // Find the correct subMenu
                { $push: { "subMenu.$.packages": newPackage._id } }  // Push new package _id
            );
        }

        return NextResponse.json({ message: "Package added successfully!" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    await connectDB();

    try {
        const body = await req.json();

        if (!body.pkgId) {
            return NextResponse.json({ message: "Package ID is required" }, { status: 400 });
        }

        // Fetch existing package to avoid overwriting missing fields
        const existingPackage = await Package.findById(body.pkgId);

        if (!existingPackage) {
            return NextResponse.json({ message: "Package not found" }, { status: 404 });
        }

        // Normalize array payloads so nested sections are reliably persisted.
        const bodyBasicDetails = body.basicDetails || {};
        const normalizedHighlights = Array.isArray(bodyBasicDetails.highlights)
            ? bodyBasicDetails.highlights
                .map((h) => ({
                    highlightName: (h?.highlightName || "").trim(),
                    highlightDesc: Array.isArray(h?.highlightDesc)
                        ? h.highlightDesc.map((d) => (d || "").trim()).filter(Boolean)
                        : [],
                }))
                .filter((h) => h.highlightName)
            : existingPackage.basicDetails?.highlights || [];

        const normalizedTableData = Array.isArray(bodyBasicDetails.tableData)
            ? bodyBasicDetails.tableData
                .map((t) => ({
                    tableName: (t?.tableName || "").trim(),
                    tableDesc: Array.isArray(t?.tableDesc)
                        ? t.tableDesc.map((d) => (d || "").trim()).filter(Boolean)
                        : [],
                }))
                .filter((t) => t.tableName)
            : existingPackage.basicDetails?.tableData || [];

        const normalizedNightStops = Array.isArray(bodyBasicDetails.nightStops)
            ? bodyBasicDetails.nightStops
                .map((stop) => (stop || "").trim())
                .filter(Boolean)
            : existingPackage.basicDetails?.nightStops || [];

        // Merge new data with existing data (to prevent missing fields)
        const nextPackageName = body.packageName ?? existingPackage.packageName;
        const nextSlug = await generateUniqueSlug(body.slug || nextPackageName, body.pkgId);

        const nextKeywords = Array.isArray(body.keywords)
            ? body.keywords.map((k) => (k || "").trim()).filter(Boolean)
            : existingPackage.keywords || [];

        const updatedData = {
            packageName: nextPackageName,
            price: body.price ?? existingPackage.price,
            priceUsd: body.priceUsd ?? existingPackage.priceUsd ?? 0,
            doubleOccupancyPrice: body.doubleOccupancyPrice ?? existingPackage.doubleOccupancyPrice ?? 0,
            doubleOccupancyPriceUsd: body.doubleOccupancyPriceUsd ?? existingPackage.doubleOccupancyPriceUsd ?? 0,
            priceUnit: body.priceUnit ?? existingPackage.priceUnit,
            link: body.link ?? existingPackage.link,
            active: body.active ?? existingPackage.active,
            isTrending: body.isTrending ?? existingPackage.isTrending,
            order: body.order ?? existingPackage.order,
            packageCode: body.packageCode ?? existingPackage.packageCode,
            slug: nextSlug || existingPackage.slug,
            titleLine:
                body.titleLine !== undefined
                    ? String(body.titleLine || "").trim()
                    : existingPackage.titleLine || "",
            keywords: nextKeywords,

            basicDetails: {
                ...existingPackage.basicDetails,
                ...bodyBasicDetails,
                highlights: normalizedHighlights,
                tableData: normalizedTableData,
                nightStops: normalizedNightStops,
            }
        };

        const updatedPackage = await Package.findByIdAndUpdate(
            body.pkgId,
            { $set: updatedData },
            { new: true, runValidators: true }
        );

        return NextResponse.json({ message: "Package updated successfully!", package: updatedPackage });
    } catch (error) {
        console.error("Error updating package:", error);
        return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
    }
}


export async function PATCH(req) {
    await connectDB();
    const body = await req.json();

    try {
        // Create update object with only the fields that are provided
        const updateFields = {};
        if (body.active !== undefined) updateFields.active = body.active;
        if (body.isTrending !== undefined) updateFields.isTrending = body.isTrending;

        if (Object.keys(updateFields).length === 0) {
            return NextResponse.json({ message: "No valid fields to update" }, { status: 400 });
        }

        const updatedPackage = await Package.findByIdAndUpdate(
            body.pkgId, 
            { $set: updateFields }, 
            { new: true, runValidators: true }
        );

        if (!updatedPackage) {
            return NextResponse.json({ message: "Package not found" }, { status: 404 });
        }

        return NextResponse.json({ 
            message: "Package updated successfully!", 
            package: updatedPackage 
        });
    } catch (error) {
        console.error("Error updating package:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    await connectDB();
    const { id } = await req.json();

    try {
        // Find the package to delete
        const packageToDelete = await Package.findById(id);
        if (!packageToDelete) {
            return NextResponse.json({ message: "Package not found!" }, { status: 404 });
        }

        // Delete thumbnail and banner images
        if (packageToDelete.basicDetails.thumbnail?.key) {
            await deleteFileFromCloudinary(packageToDelete.basicDetails.thumbnail.key);
        }
        if (packageToDelete.basicDetails.imageBanner?.key) {
            await deleteFileFromCloudinary(packageToDelete.basicDetails.imageBanner.key);
        }

        // Delete all images from the gallery
        if (packageToDelete.gallery?.length > 0) {
            for (const image of packageToDelete.gallery) {
                if (image.key) {
                    await deleteFileFromCloudinary(image.key);
                }
            }
        }

        // Delete the package from the database
        await Package.findByIdAndDelete(id);

        // Remove package references from MenuBar
        await MenuBar.updateMany(
            { "subMenu.packages": id },
            { $pull: { "subMenu.$[].packages": id } }
        );

        return NextResponse.json({ message: "Package deleted successfully!" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
