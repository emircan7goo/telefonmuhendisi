import { NextRequest, NextResponse } from 'next/server';
import { saveDeviceTelemetry, getAllFleetDevices, pollNextCommandFromDb } from '@/lib/fleetDb';
import { updateDeviceTelemetry, getAllDevices, getNextPendingCommand } from '@/lib/telemetryStore';
import { pusherServer } from '@/lib/pusher';

// Fleet-wide event trigger'ı sıkça atmayalım — 3sn'de bir en fazla bir kez.
let lastFleetTriggerAt = 0;

export async function POST(request: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }

    const deviceId = body.device_id || body.deviceInfo?.serialNumber || body.device_info?.serial_number || '1ac10c6100e93908';
    
    // Save to Postgres
    let savedDevice: any = null;
    try {
      savedDevice = await saveDeviceTelemetry(deviceId, body);
    } catch {
      savedDevice = updateDeviceTelemetry(body);
    }

    // Check if there is an immediate pending command waiting for this device in DB
    let pendingCmd: any = null;
    try {
      pendingCmd = await pollNextCommandFromDb(deviceId);
    } catch {
      pendingCmd = getNextPendingCommand(deviceId);
    }

    const responsePayload: Record<string, any> = {
      status: 'success',
      message: 'Telemetry processed and saved to device fleet',
      received_at: Date.now(),
      device: savedDevice
    };

    if (pendingCmd) {
      console.log(`⚡ [Inline Command Dispatched with Telemetry Response]: ${pendingCmd.action}`);
      responsePayload.command = {
        command_id: pendingCmd.command_id,
        action: pendingCmd.action,
        parameters: pendingCmd.parameters || pendingCmd.params || {},
        timestamp: pendingCmd.timestamp || Date.now()
      };
      responsePayload.action = pendingCmd.action;
    }

    // Cihaza özel event her zaman gitsin, fleet-updates throttle'lı gitsin.
    try {
      await pusherServer.trigger(`device-${deviceId}`, 'telemetry', {
        ts: Date.now(),
        battery: body?.battery?.percentage ?? null,
        network: body?.network?.type ?? null,
      });
      const now = Date.now();
      if (now - lastFleetTriggerAt > 3000) {
        lastFleetTriggerAt = now;
        await pusherServer.trigger('fleet-updates', 'device-heartbeat', {
          deviceId,
          ts: now,
        });
      }
    } catch {
      // Pusher yoksa sessiz geç
    }

    return NextResponse.json(responsePayload, { status: 200 });
  } catch (error: any) {
    console.error('Error processing telemetry:', error);
    return NextResponse.json(
      { status: 'error', message: error?.message || 'Server error' },
      { status: 200 }
    );
  }
}

export async function GET() {
  try {
    const devices = await getAllFleetDevices();
    return NextResponse.json(
      {
        status: 'success',
        count: devices.length,
        devices
      },
      { status: 200 }
    );
  } catch {
    const devices = getAllDevices();
    return NextResponse.json(
      {
        status: 'success',
        count: devices.length,
        devices
      },
      { status: 200 }
    );
  }
}

