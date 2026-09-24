import { NextRequest, NextResponse } from 'next/server';
import { ackCommandResult } from '@/lib/telemetryStore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📱 [Command Result ACK from Android Device]:', body);

    if (body.command_id || body.commandId) {
      ackCommandResult(
        body.command_id || body.commandId,
        body.status || 'SUCCESS',
        body.message
      );
    }

    return NextResponse.json(
      {
        status: 'success',
        message: 'Command execution result recorded successfully',
        received_at: Date.now()
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Failed to process ACK' }, { status: 400 });
  }
}
