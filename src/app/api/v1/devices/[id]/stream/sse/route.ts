import { NextRequest } from "next/server";
import { getStreamFrame, getStreamFrameAsync } from "@/lib/telemetryStore";
import { redis } from "@/lib/redis";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Server-Sent Events: her yeni frame timestamp'ını itmek yerine
 * base64 data-url'i doğrudan gönderir. Browser polling'e ihtiyaç duymaz.
 *
 * Redis varsa Pub/Sub dinler; yoksa in-memory'yi her 150ms tarayarak
 * yeni timestamp'ta event yayınlar (multi-instance dışında güvenilir).
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let lastTs = 0;
      let closed = false;

      const send = (event: string, data: string) => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${data}\n\n`));
        } catch {
          closed = true;
        }
      };

      const push = async () => {
        const frame = (await getStreamFrameAsync(id)) ?? getStreamFrame(id);
        if (frame && frame.timestamp !== lastTs) {
          lastTs = frame.timestamp;
          send("frame", JSON.stringify({ ts: frame.timestamp, data_url: frame.data_url }));
        }
      };

      send("hello", JSON.stringify({ ok: true, ts: Date.now() }));
      await push();

      // Heartbeat: 20 sn'de bir comment satırı (proxy timeout'ları için)
      const heartbeat = setInterval(() => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(`: ping ${Date.now()}\n\n`));
        } catch {
          closed = true;
        }
      }, 20000);

      let subInstance: any = null;

      if (redis) {
        // Redis pub/sub: subscribe için ayrı bir bağlantı gerekir
        try {
          subInstance = redis.duplicate();
          await subInstance.subscribe(`dev:${id}:frame`);
          subInstance.on("message", () => {
            push().catch(() => {});
          });
        } catch {
          subInstance = null;
        }
      }

      // Fallback: her 150 ms polling (redis pub/sub yoksa)
      const poll = setInterval(() => {
        if (closed) return;
        push().catch(() => {});
      }, subInstance ? 2000 : 150);

      const abort = () => {
        closed = true;
        clearInterval(heartbeat);
        clearInterval(poll);
        try { subInstance?.quit?.(); } catch {}
        try { controller.close(); } catch {}
      };

      request.signal.addEventListener("abort", abort);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
