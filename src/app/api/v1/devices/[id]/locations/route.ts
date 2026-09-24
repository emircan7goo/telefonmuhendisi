import { NextRequest, NextResponse } from 'next/server';
import { getLocationHistoryFromDb } from '@/lib/fleetDb';
import { getDeviceLocationHistory, clearDeviceLocationHistory, getDeviceById } from '@/lib/telemetryStore';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    let history: any[] = [];
    try {
      history = await getLocationHistoryFromDb(id);
    } catch (e: any) {
      console.error('Error fetching location history from DB:', e);
    }

    const headers = {
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      'Pragma': 'no-cache'
    };

    return NextResponse.json({
      status: 'success',
      history,
      total_points: history.length
    }, { status: 200, headers });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error?.message }, { status: 500 });
  }
}


export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    clearDeviceLocationHistory(id);
    return NextResponse.json({ status: 'success', message: 'Location history cleared' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error?.message }, { status: 500 });
  }
}

