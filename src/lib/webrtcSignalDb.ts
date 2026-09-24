import { sql, ensureFleetTables } from "@/lib/fleetDb";

let tableCreated = false;
async function ensureTable() {
  if (tableCreated) return;
  try {
    await ensureFleetTables();
    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS webrtc_signals (
        id TEXT PRIMARY KEY,
        device_id TEXT NOT NULL,
        type TEXT NOT NULL,
        sdp TEXT,
        candidate JSONB,
        sender TEXT NOT NULL,
        timestamp BIGINT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_webrtc_signals ON webrtc_signals (device_id, sender, timestamp);
    `);
    tableCreated = true;
  } catch (e) {
    console.error("[WebRTC Signal DB] Init table error:", e);
  }
}


export interface DbWebRtcSignal {
  id: string;
  device_id: string;
  type: string;
  sdp?: string;
  candidate?: any;
  sender: 'browser' | 'device';
  timestamp: number;
}

export async function saveSignalToDb(
  deviceId: string,
  signal: { type: string; sdp?: string; candidate?: any; sender: 'browser' | 'device' }
): Promise<DbWebRtcSignal> {
  await ensureTable();
  const id = `sig_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const timestamp = Date.now();

  if (signal.type === 'reset') {
    await sql`DELETE FROM webrtc_signals WHERE device_id = ${deviceId}`;
    return { id, device_id: deviceId, type: 'reset', sender: signal.sender, timestamp };
  }

  const candidateJson = signal.candidate ? JSON.stringify(signal.candidate) : null;

  await sql`
    INSERT INTO webrtc_signals (id, device_id, type, sdp, candidate, sender, timestamp)
    VALUES (${id}, ${deviceId}, ${signal.type}, ${signal.sdp || null}, ${candidateJson}, ${signal.sender}, ${timestamp});
  `;

  // Auto clean signals older than 3 minutes (device_id filtreli — full table scan önleme)
  const expireThreshold = Date.now() - 180000;
  sql`DELETE FROM webrtc_signals WHERE device_id = ${deviceId} AND timestamp < ${expireThreshold}`.catch(() => {});

  return {
    id,
    device_id: deviceId,
    type: signal.type,
    sdp: signal.sdp,
    candidate: signal.candidate,
    sender: signal.sender,
    timestamp
  };
}

export async function getSignalsFromDb(
  deviceId: string,
  recipient: 'browser' | 'device',
  sinceTimestamp: number = 0
): Promise<DbWebRtcSignal[]> {
  await ensureTable();
  const targetSender = recipient === 'browser' ? 'device' : 'browser';

  const rows = await sql`
    SELECT id, device_id, type, sdp, candidate, sender, timestamp
    FROM webrtc_signals
    WHERE device_id = ${deviceId}
      AND sender = ${targetSender}
      AND timestamp > ${sinceTimestamp}
    ORDER BY timestamp ASC
    LIMIT 50;
  `;

  return rows.map(r => ({
    id: r.id as string,
    device_id: r.device_id as string,
    type: r.type as string,
    sdp: (r.sdp as string) || undefined,
    candidate: r.candidate ? (typeof r.candidate === 'string' ? JSON.parse(r.candidate) : r.candidate) : undefined,
    sender: r.sender as 'browser' | 'device',
    timestamp: Number(r.timestamp)
  }));
}

export async function clearSignalsInDb(deviceId: string): Promise<void> {
  await ensureTable();
  await sql`DELETE FROM webrtc_signals WHERE device_id = ${deviceId}`;
}
