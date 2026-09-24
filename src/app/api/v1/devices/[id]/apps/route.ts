import { NextRequest, NextResponse } from 'next/server';
import { saveAppsToDb, getAppsFromDb } from '@/lib/fleetDb';
import { updateDeviceApps, getDeviceApps, InstalledApp } from '@/lib/telemetryStore';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    let apps: any[] = [];
    try {
      apps = await getAppsFromDb(id);
    } catch {
      apps = getDeviceApps(id);
    }

    const headers = {
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      'Pragma': 'no-cache'
    };

    return NextResponse.json({ status: 'success', total: apps.length, apps }, { status: 200, headers });
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
    const apps = (body.apps || []) as InstalledApp[];

    try {
      await saveAppsToDb(id, apps);
    } catch {
      updateDeviceApps(id, apps);
    }

    return NextResponse.json({ status: 'success', message: 'Installed apps fleet updated' }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating apps:', error);
    return NextResponse.json({ status: 'error', message: error?.message }, { status: 500 });
  }
}

