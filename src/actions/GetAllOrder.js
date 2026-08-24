'use server'

import connectDB from "@/lib/connectDB";
import Order from "@/models/Admin/Order";
import Package from "@/models/Admin/Package";

export async function GetAllOrder() {
    await connectDB();

    const orders = await Order.find({})
        .populate({
            path: "packageId",
            model: "Package",
        })
        .sort({ createdAt: -1 })
        .lean();

        orders.forEach(order => {
        order._id = order._id.toString();
        if (order.packageId) {
            order.packageId._id = order.packageId._id.toString();
        }
        order.userId = order.userId.toString();
    });


    return { orders };
}
