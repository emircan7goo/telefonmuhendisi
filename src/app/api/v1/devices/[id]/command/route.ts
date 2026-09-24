import { NextRequest, NextResponse } from 'next/server';
import { queueCommandInDb } from '@/lib/fleetDb';
import { queueDeviceCommand, getDeviceById, RemoteCommand } from '@/lib/telemetryStore';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const action = (body.action || 'LOCK_DEVICE') as RemoteCommand['action'];
    const parameters = body.params || body.parameters || {};

    let command: any = null;
    try {
      command = await queueCommandInDb(id, action, parameters);
    } catch {
      command = queueDeviceCommand(id, action, parameters);
    }

    console.log(`⚡ [Fleet Command Queued for ${id}]: ${action}`);

    return NextResponse.json(
      {
        status: 'success',
        message: `Command [${action}] successfully dispatched to device ${id}`,
        command
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error queuing device command:', error);
    return NextResponse.json({ status: 'error', message: error?.message }, { status: 500 });
  }
}

