import { NextRequest, NextResponse } from 'next/server';
import { pollNextCommandFromDb } from '@/lib/fleetDb';
import { getNextPendingCommand } from '@/lib/telemetryStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Aggressive anti-caching headers for real-time mobile fleet dispatch
    const headers = {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Content-Type': 'application/json'
    };

    let pendingCmd: any = getNextPendingCommand(id);
    if (!pendingCmd) {
      try {
        pendingCmd = await pollNextCommandFromDb(id);
      } catch {}
    }

    if (pendingCmd && pendingCmd.action) {
      console.log(`📱 [Command Poll Delivering to ${id}]: ${pendingCmd.action}`);
      return NextResponse.json(
        {
          command_id: pendingCmd.command_id,
          action: pendingCmd.action,
          parameters: pendingCmd.parameters || pendingCmd.params || {},
          timestamp: pendingCmd.timestamp || Date.now(),
          command: {
            command_id: pendingCmd.command_id,
            action: pendingCmd.action,
            parameters: pendingCmd.parameters || pendingCmd.params || {},
            timestamp: pendingCmd.timestamp || Date.now(),
          }
        },
        { status: 200, headers }
      );
    }

    // Fast-path empty response (under 200 bytes)
    return NextResponse.json({}, { status: 200, headers });
  } catch (error) {
    return NextResponse.json({}, { status: 200 });
  }
}


