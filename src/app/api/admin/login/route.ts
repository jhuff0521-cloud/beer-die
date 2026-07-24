import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_MAX_AGE, ADMIN_COOKIE_NAME, createSessionToken } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const password = String(form.get("password") ?? "");
  const from = String(form.get("from") ?? "/admin");
  const secret = process.env.ADMIN_PASSWORD ?? "";

  if (!secret || password !== secret) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = `?error=1&from=${encodeURIComponent(from)}`;
    return NextResponse.redirect(url, { status: 303 });
  }

  const token = await createSessionToken(secret);
  const url = req.nextUrl.clone();
  url.pathname = from.startsWith("/admin") ? from : "/admin";
  url.search = "";
  const res = NextResponse.redirect(url, { status: 303 });
  res.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_COOKIE_MAX_AGE,
  });
  return res;
}
