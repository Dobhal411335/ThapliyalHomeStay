import { NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/connectDB";
import Admin from "@/models/Admin/Admin";

/*
 * POST /api/setup/create-admin
 *
 * Creates the single administrator account.
 * Intended for INITIAL SETUP ONLY — use Postman/curl.
 * Set DISABLE_SETUP=true in .env to permanently disable this endpoint.
 */

const DISABLED = process.env.DISABLE_SETUP === "true";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(request) {
  if (DISABLED) {
    return NextResponse.json(
      { success: false, message: "Setup endpoint is disabled.", data: null },
      { status: 410 },
    );
  }

  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: parsed.error.errors[0].message,
          data: null,
        },
        { status: 400 },
      );
    }

    await connectDB();

    /* Only one admin is allowed */
    const existing = await Admin.findOne();
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Admin already exists.", data: null },
        { status: 403 },
      );
    }

    const admin = await Admin.create({
      name: parsed.data.name,
      email: parsed.data.email,
      password: parsed.data.password,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Admin created successfully.",
        data: {
          id: admin._id.toString(),
          name: admin.name,
          email: admin.email,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to create admin.", data: null,error:error.message },
      { status: 500 },
    );
  }
}
