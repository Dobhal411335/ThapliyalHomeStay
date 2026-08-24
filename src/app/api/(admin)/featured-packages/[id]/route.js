import connectDB from "@/lib/connectDB";
import FeaturedPackageCard from "@/models/Admin/FeaturedPackageCard";
import { deleteFileFromCloudinary } from "@/utils/cloudinary/index";

export const PUT = async (req, { params }) => {
    try {
        await connectDB();
        const { id } = await params;
        const { title, image, link } = await req.json();

        const updatedPackage = await FeaturedPackageCard.findByIdAndUpdate(
            id,
            { title, image, link },
            { new: true }
        );

        if (!updatedPackage) {
            return Response.json(
                { success: false, message: "Featured package not found", data: null },
                { status: 404 }
            );
        }

        return Response.json(
            { success: true, message: "Featured package updated successfully", data: updatedPackage },
            { status: 200 }
        );
    } catch (error) {
        return Response.json(
            { success: false, message: "Failed to update featured package", data: null },
            { status: 500 }
        );
    }
};

export const DELETE = async (req, { params }) => {
    try {
        await connectDB();
        const { id } = await params;

        const packageToDelete = await FeaturedPackageCard.findById(id);
        if (!packageToDelete) {
            return Response.json(
                { success: false, message: "Featured package not found", data: null },
                { status: 404 }
            );
        }

        if (packageToDelete.image?.key) {
            await deleteFileFromCloudinary(packageToDelete.image.key);
        }

        await FeaturedPackageCard.findByIdAndDelete(id);

        return Response.json(
            { success: true, message: "Featured package deleted successfully", data: null },
            { status: 200 }
        );
    } catch (error) {
        return Response.json(
            { success: false, message: "Failed to delete featured package", data: null },
            { status: 500 }
        );
    }
};
