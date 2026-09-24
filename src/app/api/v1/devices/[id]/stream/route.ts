import { NextRequest, NextResponse } from "next/server";
import { saveStreamFrame, getStreamFrame } from "@/lib/telemetryStore";
import { pusherServer } from "@/lib/pusher";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_STORE = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  "Pragma": "no-cache",
} as const;

async function triggerFrame(deviceId: string, ts: number) {
  try {
    // Küçük event (bytes yerine only-metadata). Browser bunu görünce GET binary çeker.
    await pusherServer.trigger(`device-${deviceId}`, "frame", { ts });
  } catch {
    // Pusher kredensiyeli yoksa sessiz geç
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const contentType = request.headers.get("content-type") || "";
    const ts = Date.now();

    if (contentType.startsWith("image/") || contentType === "application/octet-stream") {
      // Binary path: doğrudan JPEG bytes
      const buf = Buffer.from(await request.arrayBuffer());
      const dataUrl = "data:image/jpeg;base64," + buf.toString("base64");
      saveStreamFrame(id, dataUrl);
      triggerFrame(id, ts);
      return NextResponse.json({ status: "ok", bytes: buf.length, ts }, { headers: NO_STORE });
    }

    // Backward-compat JSON path
    const body = await request.json();
    const dataUrl = body.data_url || body.frame;
    if (!dataUrl) {
      return NextResponse.json({ error: "Missing data_url/frame" }, { status: 400, headers: NO_STORE });
    }
    saveStreamFrame(id, dataUrl);
    triggerFrame(id, ts);
    return NextResponse.json({ status: "ok", ts }, { headers: NO_STORE });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500, headers: NO_STORE });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format");

    const memFrame = getStreamFrame(id);

    if (format === "binary") {
      if (!memFrame) {
        return new NextResponse(null, { status: 204, headers: NO_STORE });
      }
      const b64 = memFrame.data_url.split(",")[1] ?? memFrame.data_url;
      const buf = Buffer.from(b64, "base64");
      return new NextResponse(buf, {
        headers: {
          ...NO_STORE,
          "Content-Type": "image/jpeg",
          "Content-Length": String(buf.length),
          "X-Frame-Ts": String(memFrame.timestamp),
        },
      });
    }

    if (!memFrame) {
      return NextResponse.json({ frame: null, timestamp: null }, { headers: NO_STORE });
    }
    return NextResponse.json(
      { frame: memFrame.data_url, timestamp: memFrame.timestamp },
      { headers: NO_STORE },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500, headers: NO_STORE });
  }
}
