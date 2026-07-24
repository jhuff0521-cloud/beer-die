import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { APPS_SCRIPT_URL } from "@/lib/api";

export async function POST(req: Request) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ success: false, message: "Not authenticated." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const photo = typeof body?.photo === "string" ? body.photo.trim() : "";
  if (!name) {
    return NextResponse.json({ success: false, message: "Player name is required." }, { status: 400 });
  }

  try {
    const res = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update_player", name, photo }),
    });
    const text = await res.text();
    let json: { status?: string } | null = null;
    try {
      json = JSON.parse(text);
    } catch {
      // Apps Script didn't return JSON — treat as unsupported
    }
    if (res.ok && json?.status === "ok") {
      return NextResponse.json({ success: true, message: `Saved ${name}.` });
    }
    return NextResponse.json(
      {
        success: false,
        message: `Apps Script did not accept this write (HTTP ${res.status}). This deployment does not yet expose a doPost handler for "update_player" — add one to the Apps Script project to enable saving from here.`,
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
