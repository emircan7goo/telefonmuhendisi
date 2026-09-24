import crypto from "crypto";

// Stateless enrollment token: base64url(payload).base64url(sig)
// payload = { exp: unix, tok: api_token, dev?: deviceId }
// sig     = HMAC-SHA256(ENROLL_SECRET, payload)

export interface EnrollmentPayload {
  exp: number; // unix seconds
  tok: string; // api_token cihazın kullanacağı
  dev?: string;
}

function secret(): string {
  const s =
    process.env.ENROLL_SECRET ??
    process.env.DEVICE_INGRESS_TOKEN ??
    process.env.AUTH_SECRET ??
    process.env.NEXTAUTH_SECRET;
  if (!s) throw new Error("ENROLL_SECRET (veya AUTH_SECRET) tanımlı değil");
  return s;
}

function b64url(buf: Buffer | string): string {
  const b = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
  return b.toString("base64").replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function b64urlDecode(s: string): Buffer {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  return Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/") + pad, "base64");
}

export function createEnrollmentToken(payload: EnrollmentPayload): string {
  const body = b64url(JSON.stringify(payload));
  const sig = b64url(crypto.createHmac("sha256", secret()).update(body).digest());
  return `${body}.${sig}`;
}

export function verifyEnrollmentToken(token: string): EnrollmentPayload | null {
  try {
    const [body, sig] = token.split(".");
    if (!body || !sig) return null;
    const expected = b64url(crypto.createHmac("sha256", secret()).update(body).digest());
    if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig))) return null;
    const payload = JSON.parse(b64urlDecode(body).toString("utf-8")) as EnrollmentPayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}
