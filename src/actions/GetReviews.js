'use server'

import connectDB from "@/lib/connectDB";
import Review from "@/models/Admin/Review";
import User from "@/models/Admin/User";

export const getReviews = async () => {
    try {
        await connectDB();
        const reviews = await Review.find()
            .populate('user') // Populate the user if it's a reference
            .sort({ createdAt: -1 })
            .lean(); // Convert Mongoose objects to plain JS objects

        const formattedReviews = reviews?.map((review) => ({
            ...review,
            _id: review?._id?.toString(),
            user: review?.user
                ? {
                    _id: review.user._id?.toString(),
                    name: review.user.name,
                    email: review.user.email,
                    isVerified: review.user.isVerified,
                    provider: review.user.provider,
                }
                : null,
                packageId: review?.packageId.toString()
        }));

        return formattedReviews;
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return [];
    }
};
