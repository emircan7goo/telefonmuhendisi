import { NextRequest, NextResponse } from "next/server";
import { saveWebRtcSignal, getWebRtcSignals, clearWebRtcSignals } from "@/lib/telemetryStore";
import { pusherServer } from "@/lib/pusher";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { type, sdp, candidate, sender } = body;

    if (!type || !sender) {
      return NextResponse.json({ error: "Missing type or sender" }, { status: 400 });
    }

    if (type === 'reset') {
      clearWebRtcSignals(id);
      try { await pusherServer.trigger(`device-${id}`, "webrtc-reset", {}); } catch {}
      return NextResponse.json({ status: "reset_ok" });
    }

    const ts = Date.now();
    saveWebRtcSignal(id, { type, sdp, candidate, sender });

    // Karşı taraf polling yapmadan almasın: eventi doğrudan Pusher üzerinden ilet.
    try {
      const target = sender === "device" ? "browser" : "device";
      await pusherServer.trigger(`device-${id}`, `webrtc-signal-${target}`, {
        type, sdp, candidate, sender, ts,
      });
    } catch {}

    return NextResponse.json({ status: "signal_saved", timestamp: ts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const recipient = (searchParams.get("recipient") || "browser") as "browser" | "device";
    const since = parseInt(searchParams.get("since") || "0", 10);

    const signals = getWebRtcSignals(id, recipient, since);

    const headers = {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
      "Pragma": "no-cache"
    };

    return NextResponse.json({ signals }, { headers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}




