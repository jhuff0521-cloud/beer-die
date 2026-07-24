import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { APPS_SCRIPT_URL } from "@/lib/api";

export async function POST(req: Request) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ success: false, message: "Not authenticated." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const headline = typeof body?.headline === "string" ? body.headline.trim() : "";
  const articleBody = typeof body?.body === "string" ? body.body.trim() : "";
  const excerpt = typeof body?.excerpt === "string" ? body.excerpt.trim() : "";
  if (!headline || !articleBody) {
    return NextResponse.json(
      { success: false, message: "Headline and body are required." },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "add_news",
        headline,
        excerpt,
        body: articleBody,
        date: new Date().toISOString().slice(0, 10),
      }),
    });
    const text = await res.text();
    let json: { status?: string } | null = null;
    try {
      json = JSON.parse(text);
    } catch {
      // Apps Script didn't return JSON — treat as unsupported
    }
    if (res.ok && json?.status === "ok") {
      return NextResponse.json({ success: true, message: `Published "${headline}".` });
    }
    return NextResponse.json(
      {
        success: false,
        message: `Apps Script did not accept this write (HTTP ${res.status}). This deployment does not yet expose a doPost handler for "add_news" — add one to the Apps Script project to enable publishing from here.`,
      },
      { status: 502 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Could not reach the Apps Script API." },
      { status: 502 }
    );
  }
}
