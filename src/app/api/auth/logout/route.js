import { NextResponse } from "next/server";
import { clearAuthCookie, getTokenFromCookies, verifyToken } from "@/lib/auth";
import { logLogout } from "@/lib/logger";

function getClientInfo(request) {
  return {
    ip:
      request.headers.get("x-forwarded-for") ??
      request.headers.get("x-real-ip") ??
      "unknown",
    userAgent: request.headers.get("user-agent") ?? "unknown",
  };
}

export async function POST(request) {
  const { ip, userAgent } = getClientInfo(request);
  let email = "unknown";

  try {
    /* Decode email from token for logging (best-effort) */
    const token = await getTokenFromCookies();
    if (token) {
      try {
        const decoded = verifyToken(token);
        email = decoded.email ?? "unknown";
      } catch {
        /* Expired or malformed — still clear the cookie */
      }
    }

    await clearAuthCookie();
    logLogout({ email, ip, userAgent });

    return NextResponse.json({
      success: true,
      message: "Logged out successfully.",
      data: null,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Logout failed.", data: null },
      { status: 500 },
    );
  }
}
