import { NextRequest, NextResponse } from 'next/server';
import { saveMediaToDb, getMediaFromDb, clearMediaFromDb } from '@/lib/fleetDb';
import { addCapturedMedia, getDeviceMedia, clearDeviceMedia, CapturedMedia } from '@/lib/telemetryStore';


export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '40', 10);
    
    let media: any[] = [];
    try {
      media = await getMediaFromDb(id, limit);
    } catch (e: any) {
      console.error('Error fetching media from DB:', e);
    }

    const headers = {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      'Pragma': 'no-cache'
    };

    return NextResponse.json({ status: 'success', media, total: media.length }, { status: 200, headers });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error?.message }, { status: 500 });
  }
}


export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const dataUrl = body.data_url || body.image_base64 || body.url || '';
    const type = (body.type || 'PHOTO_FRONT') as CapturedMedia['type'];
    const label = body.label || (type === 'PHOTO_FRONT' ? 'Ön Kamera Fotoğrafı' : type === 'PHOTO_BACK' ? 'Arka Kamera Fotoğrafı' : 'Ekran Görüntüsü');
    const sizeBytes = body.size_bytes || Math.round((dataUrl.length * 3) / 4);
    const capturedAt = Number(body.captured_at) || Date.now();

    const media = await saveMediaToDb(id, {
      type,
      label,
      data_url: dataUrl,
      size_bytes: sizeBytes,
      captured_at: capturedAt
    });

    return NextResponse.json({ status: 'success', media }, { status: 200 });
  } catch (error: any) {
    console.error('Error saving device media:', error);
    return NextResponse.json({ status: 'error', message: error?.message }, { status: 500 });
  }
}


export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await clearMediaFromDb(id);
    clearDeviceMedia(id);
    return NextResponse.json({ status: 'success', message: 'Media gallery cleared' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error?.message }, { status: 500 });
  }
}


