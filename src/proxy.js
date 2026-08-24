import { NextResponse } from "next/server";

/*
 * Route protection proxy.
 *
 * - Unauthenticated users visiting /admin/* → redirect to /admin/login
 * - Authenticated users visiting /admin/login → redirect to /admin
 *
 * NOTE: Checks cookie presence only (Edge Runtime compatible).
 * Full JWT signature verification happens in each API route handler.
 */

const COOKIE_NAME = "thapliyal_token";

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const isLoginPage = pathname === "/admin/login";

  /* Authenticated → login page: redirect to dashboard */
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  /* Unauthenticated → any admin page (except login): redirect to login */
  if (!isLoginPage && !token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
