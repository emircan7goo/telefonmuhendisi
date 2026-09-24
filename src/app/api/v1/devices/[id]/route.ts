import { NextRequest, NextResponse } from 'next/server';
import { getDeviceById } from '@/lib/telemetryStore';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const device = getDeviceById(id);
    if (!device) {
      return NextResponse.json({ status: 'error', message: `Device not found: ${id}` }, { status: 404 });
    }
    return NextResponse.json({ status: 'success', device }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Failed to fetch device' }, { status: 500 });
  }
}
