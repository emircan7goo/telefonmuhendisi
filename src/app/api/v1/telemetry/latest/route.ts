import { NextResponse } from 'next/server';
import { getAllDevices } from '@/lib/telemetryStore';

export async function GET() {
  const devices = getAllDevices();
  const latestDevice = devices[0] || null;

  return NextResponse.json(
    {
      status: 'success',
      timestamp: Date.now(),
      total_devices: devices.length,
      data: latestDevice,
      devices
    },
    { status: 200 }
  );
}
