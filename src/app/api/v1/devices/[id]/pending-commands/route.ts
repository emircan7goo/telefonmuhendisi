import { NextRequest, NextResponse } from 'next/server';
import { getPendingCommandsForDevice } from '@/lib/telemetryStore';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const commands = getPendingCommandsForDevice(id);
    return NextResponse.json(commands, { status: 200 });
  } catch (error) {
    return NextResponse.json([], { status: 200 });
  }
}
