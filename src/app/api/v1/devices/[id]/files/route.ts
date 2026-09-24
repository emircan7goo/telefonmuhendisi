import { NextRequest, NextResponse } from 'next/server';
import { saveFilesToDb, getFilesFromDb } from '@/lib/fleetDb';
import { updateDeviceFiles, getDeviceFiles, FileItem } from '@/lib/telemetryStore';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    let filesData: any = null;
    try {
      filesData = await getFilesFromDb(id);
    } catch {
      filesData = getDeviceFiles(id);
    }

    const headers = {
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      'Pragma': 'no-cache'
    };

    return NextResponse.json({ status: 'success', ...filesData }, { status: 200, headers });
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

    const currentPath = body.current_path || '/sdcard';
    const items = (body.items || []) as FileItem[];

    try {
      await saveFilesToDb(id, currentPath, items);
    } catch {
      updateDeviceFiles(id, currentPath, items);
    }

    return NextResponse.json({ status: 'success', message: 'File listing updated' }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating files:', error);
    return NextResponse.json({ status: 'error', message: error?.message }, { status: 500 });
  }
}

