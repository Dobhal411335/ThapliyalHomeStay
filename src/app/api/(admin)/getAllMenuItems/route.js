import connectDB from "@/lib/connectDB";
import MenuBar from "@/models/Admin/MenuBar";
import { NextResponse } from "next/server";
import Package from "@/models/Admin/Package"
export async function GET(req) {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const frontendOnly = searchParams.get("frontendOnly") === "1" || searchParams.get("frontendOnly") === "true"

    const menu = await MenuBar.find({})
        .populate({
            path: 'subMenu.packages',
        })
        .sort({ order: 1 });

    const output = frontendOnly
        ? menu
            .filter((item) => item.active)
            .map((item) => ({
                ...item.toObject(),
                subMenu: Array.isArray(item.subMenu)
                    ? item.subMenu.filter((subItem) => subItem.active)
                    : [],
            }))
        : menu

    return NextResponse.json(output);
}