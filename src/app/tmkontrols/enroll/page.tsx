import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { createEnrollmentToken } from "@/lib/enrollment";
import crypto from "crypto";
import QRCode from "qrcode";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export default async function EnrollPage({
  searchParams,
}: {
  searchParams: Promise<{ ttl?: string; device?: string }>;
}) {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session || !["admin", "technician"].includes(role)) {
    redirect("/tmkontrols-giris?callbackUrl=/tmkontrols/enroll");
  }

  const sp = await searchParams;
  const ttlMin = Math.max(1, Math.min(1440, Number(sp.ttl ?? 30)));
  const deviceId = (sp.device || "").trim() || undefined;

  const apiToken = crypto.randomBytes(24).toString("base64url");
  const exp = Math.floor(Date.now() / 1000) + ttlMin * 60;
  const token = createEnrollmentToken({ exp, tok: apiToken, dev: deviceId });

  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3000";
  const proto = h.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
  const enrollUrl = `${proto}://${host}/api/v1/enroll/${token}`;
  const deepLink = `mdmconfig://enroll?url=${encodeURIComponent(enrollUrl)}`;

  const qrDataUrl = await QRCode.toDataURL(deepLink, {
    errorCorrectionLevel: "M",
    margin: 1,
    scale: 8,
    color: { dark: "#0f172a", light: "#ffffff" },
  });

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Cihaz kurulum QR</h1>
        <p className="text-sm text-slate-500 mt-1">
          APK cihazda kuruluysa QR'ı okutmak ya da bağlantıyı açmak yeterli. Token {ttlMin} dakika geçerli.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrDataUrl} alt="Enrollment QR" className="w-72 h-72" />
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <label className="text-xs uppercase text-slate-500">Deep link</label>
            <textarea
              readOnly
              value={deepLink}
              className="w-full mt-1 p-2 border rounded text-xs font-mono"
              rows={3}
            />
          </div>
          <div>
            <label className="text-xs uppercase text-slate-500">Enrollment URL</label>
            <textarea
              readOnly
              value={enrollUrl}
              className="w-full mt-1 p-2 border rounded text-xs font-mono"
              rows={3}
            />
          </div>
          <div>
            <label className="text-xs uppercase text-slate-500">API token (cihazda saklanacak)</label>
            <input
              readOnly
              value={apiToken}
              className="w-full mt-1 p-2 border rounded text-xs font-mono"
            />
          </div>

          <form className="flex gap-2 items-end text-sm">
            <label className="flex-1">
              <span className="text-xs text-slate-500">TTL (dakika)</span>
              <input name="ttl" type="number" defaultValue={ttlMin} min={1} max={1440}
                className="w-full mt-1 p-2 border rounded" />
            </label>
            <label className="flex-1">
              <span className="text-xs text-slate-500">Device ID (opsiyonel)</span>
              <input name="device" defaultValue={deviceId ?? ""} placeholder="boşsa cihaz kendi id'sini kullanır"
                className="w-full mt-1 p-2 border rounded" />
            </label>
            <button type="submit" className="px-4 py-2 bg-slate-900 text-white rounded">
              Yeni QR üret
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
