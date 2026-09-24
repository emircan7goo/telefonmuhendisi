import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

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
    // We allow anonymous uploads for the repair quote / device sale wizard
    // so users can attach photos before creating an account.
    const session = await auth();

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const folder = req.nextUrl.searchParams.get("folder") || "repairs";
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const r2 = getR2Client();
    const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME;
    const publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL;

    // Temporarily disabled R2 upload because the pub-*.r2.dev URL is throwing SSL/Public Access errors.
    // Forcing Base64 data URI to ensure images work instantly.
    /*
    if (r2 && bucketName && publicUrl) {
      // Upload to Cloudflare R2
      await r2.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: filename,
          Body: buffer,
          ContentType: file.type || "image/jpeg",
          CacheControl: "public, max-age=31536000",
        })
      );

      const fileUrl = `${publicUrl.replace(/\/$/, "")}/${filename}`;
      return NextResponse.json({ success: true, url: fileUrl });
    }
    */

    // Fallback: Return base64 string directly (Works on Vercel without external storage)
    const base64Data = buffer.toString("base64");
    const mimeType = file.type || "image/jpeg";
    const dataUri = `data:${mimeType};base64,${base64Data}`;
    
    return NextResponse.json({ success: true, url: dataUri });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
