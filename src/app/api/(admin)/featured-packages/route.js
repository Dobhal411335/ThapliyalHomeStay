import connectDB from "@/lib/connectDB";
import FeaturedPackageCard from "@/models/Admin/FeaturedPackageCard";

export const GET = async () => {
    try {
        await connectDB();
        const packages = await FeaturedPackageCard.find({});
        return Response.json(
            { success: true, message: "Featured packages fetched successfully", data: packages },
            { status: 200 }
        );
    } catch (error) {
        return Response.json(
            { success: false, message: "Failed to fetch featured packages", data: null },
            { status: 500 }
        );
    }
};

export const POST = async (req) => {
    try {
        await connectDB();

        const totalPackages = await FeaturedPackageCard.countDocuments();
        if (totalPackages >= 12) {
            return Response.json(
                { success: false, message: "Maximum limit of 12 featured packages reached", data: null },
                { status: 400 }
            );
        }

        const body = await req.json();
        const { title, image, link } = body;

        if (!title || !image?.url || !image?.key || !link) {
            return Response.json(
                { success: false, message: "Missing required fields", data: null },
                { status: 400 }
            );
        }

        const newPackage = new FeaturedPackageCard({
            title,
            image,
            link,
        });
        await newPackage.save();

        return Response.json(
            { success: true, message: "Featured package created successfully", data: newPackage },
            { status: 201 }
        );
    } catch (error) {
        console.error("POST Error:", error);
        return Response.json(
            { success: false, message: "Failed to create featured package", data: null },
            { status: 500 }
        );
    }
};
