import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const COOKIE_NAME = "thapliyal_token";
const DEFAULT_EXPIRES = "7d";

/* ── Sign a JWT ──────────────────────────────────── */
export function signToken(payload) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not configured.");
  const expiresIn = process.env.JWT_EXPIRES || DEFAULT_EXPIRES;
  return jwt.sign(payload, secret, { expiresIn });
}

/* ── Verify a JWT (Node.js runtime only) ─────────── */
export function verifyToken(token) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not configured.");
  return jwt.verify(token, secret);
}

/* ── Set HTTP-only auth cookie ───────────────────── */
export async function setAuthCookie(token, rememberMe = false) {
  const cookieStore = await cookies();
  /* rememberMe: 30 days — otherwise 7 days */
  const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60;
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge,
    path: "/",
  });
}

/* ── Clear auth cookie ───────────────────────────── */
export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/* ── Read token from incoming request cookies ────── */
export async function getTokenFromCookies() {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value ?? null;
}

/* ── Decode token without verifying (for display) ── */
export function decodeToken(token) {
  return jwt.decode(token);
}
