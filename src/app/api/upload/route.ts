import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { rateLimit, rateLimitGcTick } from "@/lib/rateLimit";

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_FOLDERS = new Set(["repairs", "device-sales", "products", "messages"]);

type AllowedImage = { mime: string; ext: string };

// İstemcinin gönderdiği MIME/uzantıya güvenme: dosyanın ilk byte'larından gerçek türü çıkar.
function detectImageType(bytes: Uint8Array): AllowedImage | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return { mime: "image/jpeg", ext: "jpg" };
  }
  const png = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (bytes.length >= 8 && png.every((b, i) => bytes[i] === b)) {
    return { mime: "image/png", ext: "png" };
  }
  const ascii = (start: number, end: number) => String.fromCharCode(...bytes.slice(start, end));
  if (bytes.length >= 12 && ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") {
    return { mime: "image/webp", ext: "webp" };
  }
  return null;
}

// Cloudflare R2 client (S3-compatible)
const getR2Client = () => {
  const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    return null;
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
};

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "Fotoğraf yüklemek için lütfen giriş yapın." }, { status: 401 });
    }

    // Not: in-memory limit izolasyon başına çalışır; Faz 3'te paylaşımlı store'a taşınacak.
    rateLimitGcTick();
    const rl = rateLimit(`upload:${userId}`, { capacity: 20, refillPerSec: 1 / 30 });
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Çok fazla yükleme yaptınız. Lütfen biraz bekleyin." },
        { status: 429, headers: { "Retry-After": String(Math.ceil(rl.resetInMs / 1000)) } },
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Dosya bulunamadı." }, { status: 400 });
    }
    if (file.size === 0 || file.size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: "Dosya boyutu en fazla 5 MB olabilir." }, { status: 413 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const detected = detectImageType(buffer);
    if (!detected) {
      return NextResponse.json({ error: "Sadece JPEG, PNG veya WEBP görseller yüklenebilir." }, { status: 415 });
    }

    const requestedFolder = req.nextUrl.searchParams.get("folder") || "repairs";
    const folder = ALLOWED_FOLDERS.has(requestedFolder) ? requestedFolder : "repairs";
    const filename = `${folder}/${Date.now()}-${crypto.randomUUID()}.${detected.ext}`;

    // R2, public erişim için custom domain ayarlanınca UPLOAD_STORAGE=r2 ile açılır.
    // (pub-*.r2.dev adresi SSL/public access hatası verdiği için varsayılan kapalı.)
    const r2 = getR2Client();
    const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME;
    const publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL;

    if (process.env.UPLOAD_STORAGE === "r2" && r2 && bucketName && publicUrl) {
      await r2.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: filename,
          Body: buffer,
          ContentType: detected.mime,
          CacheControl: "public, max-age=31536000, immutable",
        })
      );

      const fileUrl = `${publicUrl.replace(/\/$/, "")}/${filename}`;
      return NextResponse.json({ success: true, url: fileUrl });
    }

    // Fallback: doğrulanmış görseli base64 data URI olarak döndür.
    const dataUri = `data:${detected.mime};base64,${buffer.toString("base64")}`;
    return NextResponse.json({ success: true, url: dataUri });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Yükleme başarısız." }, { status: 500 });
  }
}
