import { NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/connectDB";
import Admin from "@/models/Admin/Admin";
import { signToken, setAuthCookie } from "@/lib/auth";
import { logLogin } from "@/lib/logger";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

function getClientInfo(request) {
  const ip =
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    "unknown";
  const userAgent = request.headers.get("user-agent") ?? "unknown";
  return { ip, userAgent };
}

export async function POST(request) {
  const { ip, userAgent } = getClientInfo(request);

  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      logLogin({
        email: body?.email ?? "unknown",
        ip,
        userAgent,
        success: false,
        reason: "Validation failed",
      });
      return NextResponse.json(
        { success: false, message: "Invalid email or password.", data: null },
        { status: 400 },
      );
    }

    await connectDB();

    const admin = await Admin.findOne({
      email: parsed.data.email.toLowerCase(),
    });

    if (!admin || !admin.isActive) {
      logLogin({
        email: parsed.data.email,
        ip,
        userAgent,
        success: false,
        reason: "Admin not found or inactive",
      });
      return NextResponse.json(
        { success: false, message: "Invalid email or password.", data: null },
        { status: 401 },
      );
    }

    const passwordMatch = await admin.comparePassword(parsed.data.password);

    if (!passwordMatch) {
      logLogin({
        email: parsed.data.email,
        ip,
        userAgent,
        success: false,
        reason: "Incorrect password",
      });
      return NextResponse.json(
        { success: false, message: "Invalid email or password.", data: null },
        { status: 401 },
      );
    }

    /* Generate JWT and store in HTTP-only cookie */
    const token = signToken({
      adminId: admin._id.toString(),
      email: admin.email,
    });
    await setAuthCookie(token, parsed.data.rememberMe ?? false);

    /* Update last login timestamp */
    admin.lastLogin = new Date();
    await admin.save({ validateBeforeSave: false });

    logLogin({ email: admin.email, ip, userAgent, success: true });

    return NextResponse.json({
      success: true,
      message: "Login successful.",
      data: { name: admin.name, email: admin.email },
    });
  } catch (error) {
    logLogin({
      email: "unknown",
      ip,
      userAgent,
      success: false,
      reason: error.message,
    });
    return NextResponse.json(
      { success: false, message: "Login failed. Please try again.", data: null },
      { status: 500 },
    );
  }
}
