import connectDB from "@/lib/connectDB";
import Package from "@/models/Admin/Package";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const packages = await Package.find({ active: true })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ packages }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
