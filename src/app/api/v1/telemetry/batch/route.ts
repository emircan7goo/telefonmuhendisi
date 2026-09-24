import { NextRequest, NextResponse } from 'next/server';
import { updateDeviceTelemetry } from '@/lib/telemetryStore';

export async function POST(request: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }

    const items = Array.isArray(body) ? body : (body.telemetry || [body]);
    for (const item of items) {
      if (item && typeof item === 'object') {
        updateDeviceTelemetry(item);
      }
    }

    return NextResponse.json({
      status: 'success',
      processed: items.length,
      timestamp: Date.now()
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ status: 'success', message: 'Ignored' }, { status: 200 });
  }
}
