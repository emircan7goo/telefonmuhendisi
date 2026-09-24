// Multi-device persistent store for MDM fleet management, telemetries, media, files, apps, and audit logs
import fs from 'fs';
import path from 'path';
import { redis } from './redis';
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
} from './deviceTypes';

export * from './deviceTypes';

const OFFLINE_THRESHOLD_MS = 120 * 1000; // 120 seconds heartbeat threshold

declare global {
  var __fleetDevices: Map<string, DeviceState> | undefined;
  var __fleetCommands: RemoteCommand[] | undefined;
  var __fleetMedia: CapturedMedia[] | undefined;
  var __fleetFiles: Map<string, { current_path: string; items: FileItem[] }> | undefined;
  var __fleetAuditLogs: DeviceAuditLog[] | undefined;
  var __fleetApps: Map<string, InstalledApp[]> | undefined;
  var __fleetLocationHistory: Map<string, LocationBreadcrumb[]> | undefined;
  var __fleetIntelligence: Map<string, IntelligenceHubState> | undefined;
  var __fleetDbLoaded: boolean | undefined;
  var __fleetStreamFrames: Map<string, StreamFrame> | undefined;
  var __fleetWebRtcSignals: Map<string, WebRtcSignal[]> | undefined;
}

function calculateHaversineDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// =============================================================================
// KALICI DİSK VERİTABANI (PERMANENT JSON PERSISTENCE ENGINE)
// =============================================================================
const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'fleet_database.json');

function ensureDbLoaded() {
  if (global.__fleetDbLoaded) return;
  global.__fleetDbLoaded = true;

  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      if (raw.trim()) {
        const data = JSON.parse(raw);
        if (data.devices && Array.isArray(data.devices)) global.__fleetDevices = new Map(data.devices);
        if (data.commands && Array.isArray(data.commands)) global.__fleetCommands = data.commands;
        if (data.media && Array.isArray(data.media)) global.__fleetMedia = data.media;
        if (data.files && Array.isArray(data.files)) global.__fleetFiles = new Map(data.files);
        if (data.auditLogs && Array.isArray(data.auditLogs)) global.__fleetAuditLogs = data.auditLogs;
        if (data.apps && Array.isArray(data.apps)) global.__fleetApps = new Map(data.apps);
        if (data.intelligence && Array.isArray(data.intelligence)) global.__fleetIntelligence = new Map(data.intelligence);
        
        if (data.locationHistory && Array.isArray(data.locationHistory)) {
          const cleanHistory = new Map<string, LocationBreadcrumb[]>();
          for (const [devId, crumbs] of data.locationHistory) {
            if (Array.isArray(crumbs)) {
              const deduped: LocationBreadcrumb[] = [];
              for (const c of crumbs) {
                if (!deduped.length) {
                  deduped.push(c);
                } else {
                  const last = deduped[deduped.length - 1];
                  const dist = calculateHaversineDistanceMeters(last.latitude, last.longitude, c.latitude, c.longitude);
                  if (dist >= 65) deduped.push(c);
                }
              }
              cleanHistory.set(devId, deduped.slice(0, 50));
            }
          }
          global.__fleetLocationHistory = cleanHistory;
        }

        console.log(`💾 [Kalıcı Veritabanı Yüklendi]: Cihazlar: ${global.__fleetDevices?.size || 0}`);
      }
    }
  } catch (err) {
    console.error('Kalıcı veritabanı yüklenirken hata:', err);
  }
}

// NOTE: JSON dosyasına yazma (writeFileSync) bloklayıcı ve yatay ölçeklenemez.
// Faz 3'te Postgres/Redis'e taşınıyor. Şimdilik in-memory kalıcılık + isteğe bağlı
// arka plan flush (env FLEET_JSON_PERSIST=true ile aktif). Prod'da kullanma.
let saveTimeout: NodeJS.Timeout | null = null;
function persistDb() {
  if (process.env.FLEET_JSON_PERSIST !== "true") return;
  if (saveTimeout) return;
  saveTimeout = setTimeout(() => {
    saveTimeout = null;
    try {
      if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
      const data = {
        devices: Array.from(getDeviceStore().entries()),
        commands: getCommandsList().slice(-60),
        media: getMediaStore().slice(0, 100),
        files: Array.from(getFilesStore().entries()),
        auditLogs: getAuditLogsStore().slice(0, 300),
        apps: Array.from(getAppsStore().entries()),
        locationHistory: Array.from(getLocationHistoryStore().entries()),
        intelligence: Array.from(getIntelligenceStore().entries()),
      };
      // Non-blocking; hata olursa in-memory zaten canlı.
      fs.promises
        .writeFile(DB_FILE, JSON.stringify(data), "utf-8")
        .catch((err) => console.warn("[telemetryStore] async persist:", err.message));
    } catch (err) {
      console.warn("[telemetryStore] persist skipped:", (err as Error).message);
    }
  }, 500);
}

function getDeviceStore(): Map<string, DeviceState> {
  ensureDbLoaded();
  if (!global.__fleetDevices) {
    global.__fleetDevices = new Map<string, DeviceState>();
    global.__fleetDevices.set(REAL_A71_DEVICE.device_id, REAL_A71_DEVICE);
  }
  return global.__fleetDevices;
}

function getCommandsList(): RemoteCommand[] {
  ensureDbLoaded();
  if (!global.__fleetCommands) {
    global.__fleetCommands = [];
  }
  return global.__fleetCommands;
}

function getMediaStore(): CapturedMedia[] {
  ensureDbLoaded();
  if (!global.__fleetMedia) {
    global.__fleetMedia = [];
  }
  return global.__fleetMedia;
}

function getFilesStore(): Map<string, { current_path: string; items: FileItem[] }> {
  ensureDbLoaded();
  if (!global.__fleetFiles) {
    global.__fleetFiles = new Map();
  }
  return global.__fleetFiles;
}

function getAuditLogsStore(): DeviceAuditLog[] {
  ensureDbLoaded();
  if (!global.__fleetAuditLogs) {
    global.__fleetAuditLogs = [];
  }
  return global.__fleetAuditLogs;
}

function getAppsStore(): Map<string, InstalledApp[]> {
  ensureDbLoaded();
  if (!global.__fleetApps) {
    global.__fleetApps = new Map();
  }
  return global.__fleetApps;
}

function getLocationHistoryStore(): Map<string, LocationBreadcrumb[]> {
  ensureDbLoaded();
  if (!global.__fleetLocationHistory) {
    global.__fleetLocationHistory = new Map();
  }
  return global.__fleetLocationHistory;
}

function getIntelligenceStore(): Map<string, IntelligenceHubState> {
  ensureDbLoaded();
  if (!global.__fleetIntelligence) {
    global.__fleetIntelligence = new Map();
  }
  return global.__fleetIntelligence;
}

// -------------------------------------------------------------
// FLEET MANAGEMENT API
// -------------------------------------------------------------
export function getAllDevices(): DeviceState[] {
  const store = getDeviceStore();
  const now = Date.now();
  for (const device of store.values()) {
    device.is_online = now - device.last_seen_at < OFFLINE_THRESHOLD_MS;
  }
  return Array.from(store.values());
}

export function getDevice(deviceId: string): DeviceState | null {
  const store = getDeviceStore();
  const dev = store.get(deviceId);
  if (dev) {
    dev.is_online = Date.now() - dev.last_seen_at < OFFLINE_THRESHOLD_MS;
    return dev;
  }
  return null;
}

export const getDeviceById = getDevice;

export function updateDeviceTelemetry(deviceIdOrPayload: string | any, maybePayload?: any): DeviceState {
  let deviceId: string;
  let payload: Partial<DeviceState>;

  if (typeof deviceIdOrPayload === 'string') {
    deviceId = deviceIdOrPayload;
    payload = maybePayload || {};
  } else {
    payload = deviceIdOrPayload || {};
    deviceId = payload.device_id || (payload as any)?.deviceInfo?.serialNumber || (payload as any)?.device_info?.serial_number || REAL_A71_DEVICE.device_id;
  }

  const store = getDeviceStore();
  const existing = store.get(deviceId) || {
    ...REAL_A71_DEVICE,
    device_id: deviceId,
  };

  const updated: DeviceState = {
    ...existing,
    ...payload,
    last_seen_at: Date.now(),
    is_online: true
  };

  store.set(deviceId, updated);
  persistDb();
  return updated;
}


export function registerDevice(device: DeviceState): DeviceState {
  const store = getDeviceStore();
  store.set(device.device_id, {
    ...device,
    last_seen_at: Date.now(),
    is_online: true
  });
  persistDb();
  return device;
}

export function deleteDevice(deviceId: string): boolean {
  const store = getDeviceStore();
  const res = store.delete(deviceId);
  persistDb();
  return res;
}

// -------------------------------------------------------------
// COMMANDS
// -------------------------------------------------------------
export function addCommand(deviceIdOrCommand: string | any, action?: string, parameters?: any): RemoteCommand {
  let cmd: any;
  if (typeof deviceIdOrCommand === 'string') {
    cmd = {
      device_id: deviceIdOrCommand,
      action: action || 'START_SCREEN_STREAM',
      parameters: parameters || {}
    };
  } else {
    cmd = deviceIdOrCommand || {};
  }

  const list = getCommandsList();
  const cmdId = cmd.command_id || cmd.id || `cmd_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const newCmd: any = {
    command_id: cmdId,
    id: cmdId,
    device_id: cmd.device_id,
    action: cmd.action,
    parameters: cmd.parameters || cmd.params || {},
    params: cmd.parameters || cmd.params || {},
    status: 'PENDING',
    issued_at: Date.now(),
    timestamp: Date.now(),
    created_at: Date.now()
  };
  list.push(newCmd);
  persistDb();
  return newCmd;
}

export const queueDeviceCommand = addCommand;

export function getPendingCommands(deviceId: string): RemoteCommand[] {
  const list = getCommandsList();
  return list.filter(c => c.device_id === deviceId && c.status === 'PENDING');
}

export const getPendingCommandsForDevice = getPendingCommands;

export function getNextPendingCommand(deviceId: string): (RemoteCommand & { command_id: string; params: any; timestamp: number }) | null {
  const list = getCommandsList();
  const cmd = list.find(c => c.device_id === deviceId && c.status === 'PENDING');
  if (cmd) {
    cmd.status = 'SENT';
    persistDb();
    const cmdId = cmd.command_id || (cmd as any).id || '';
    return {
      ...cmd,
      command_id: cmdId,
      params: cmd.parameters || cmd.params || {},
      timestamp: cmd.timestamp || cmd.issued_at || (cmd as any).created_at || Date.now()
    };
  }
  return null;
}

export function updateCommandStatus(commandId: string, status: any, result?: any): RemoteCommand | null {
  const list = getCommandsList();
  const cmd = list.find(c => c.command_id === commandId || (c as any).id === commandId);
  if (cmd) {
    cmd.status = status;
    if (result !== undefined) (cmd as any).result = result;
    if (status === 'COMPLETED' || status === 'EXECUTED' || status === 'FAILED') {
      (cmd as any).executed_at = Date.now();
    }
    persistDb();
    return cmd;
  }
  return null;
}


export function getRecentCommands(deviceId: string, limit: number = 30): RemoteCommand[] {
  const list = getCommandsList();
  return list.filter(c => c.device_id === deviceId).slice(-limit).reverse();
}

// -------------------------------------------------------------
// MEDIA
// -------------------------------------------------------------
export function addMedia(media: Omit<CapturedMedia, 'id'>): CapturedMedia {
  const list = getMediaStore();
  const newMedia: CapturedMedia = {
    ...media,
    id: `med_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
  };
  list.unshift(newMedia);
  if (list.length > 100) list.pop();
  persistDb();
  return newMedia;
}

export function getMedia(deviceId: string, limit: number = 50): CapturedMedia[] {
  const list = getMediaStore();
  return list.filter(m => m.device_id === deviceId).slice(0, limit);
}

// -------------------------------------------------------------
// FILES
// -------------------------------------------------------------
export function updateFiles(deviceId: string, currentPath: string, items: FileItem[]) {
  const store = getFilesStore();
  store.set(deviceId, { current_path: currentPath, items });
  persistDb();
}

export function getFiles(deviceId: string): { current_path: string; items: FileItem[] } {
  const store = getFilesStore();
  return store.get(deviceId) || { current_path: '/sdcard', items: [] };
}

// -------------------------------------------------------------
// AUDIT LOGS
// -------------------------------------------------------------
export function addAuditLog(log: Omit<DeviceAuditLog, 'id' | 'timestamp'>): DeviceAuditLog {
  const list = getAuditLogsStore();
  const newLog: DeviceAuditLog = {
    ...log,
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: Date.now()
  };
  list.unshift(newLog);
  if (list.length > 300) list.pop();
  persistDb();
  return newLog;
}

export function getAuditLogs(deviceId: string, limit: number = 100): DeviceAuditLog[] {
  const list = getAuditLogsStore();
  return list.filter(l => l.device_id === deviceId).slice(0, limit);
}

// -------------------------------------------------------------
// APPS
// -------------------------------------------------------------
export function updateApps(deviceId: string, apps: InstalledApp[]) {
  const store = getAppsStore();
  store.set(deviceId, apps);
  persistDb();
}

export function getApps(deviceId: string): InstalledApp[] {
  const store = getAppsStore();
  return store.get(deviceId) || [];
}

// -------------------------------------------------------------
// LOCATION HISTORY
// -------------------------------------------------------------
export function addLocationBreadcrumb(deviceId: string, breadcrumb: Omit<LocationBreadcrumb, 'id'>) {
  const store = getLocationHistoryStore();
  const history = store.get(deviceId) || [];
  
  if (history.length > 0) {
    const last = history[0];
    const dist = calculateHaversineDistanceMeters(last.latitude, last.longitude, breadcrumb.latitude, breadcrumb.longitude);
    if (dist < 65) return;
  }

  const newCrumb: LocationBreadcrumb = {
    ...breadcrumb,
    id: `loc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
  };
  history.unshift(newCrumb);
  if (history.length > 50) history.pop();
  store.set(deviceId, history);
  persistDb();
}

export function getLocationHistory(deviceId: string): LocationBreadcrumb[] {
  const store = getLocationHistoryStore();
  return store.get(deviceId) || [];
}

// -------------------------------------------------------------
// INTELLIGENCE
// -------------------------------------------------------------
export function getIntelligence(deviceId: string): any {
  const store = getIntelligenceStore();
  return store.get(deviceId) || {
    device_id: deviceId,
    background_mode_active: false,
    activity_logger_active: true,
    audio_monitor_active: false,
    camera_monitor_active: false,
    turbo_stream_active: false,
    device_health_status: 'GOOD',
    last_health_check_at: Date.now()
  };
}

export function updateIntelligence(deviceId: string, data: Partial<IntelligenceHubState>): IntelligenceHubState {
  const store = getIntelligenceStore();
  const current = getIntelligence(deviceId);
  const updated = { ...current, ...data };
  store.set(deviceId, updated);
  persistDb();
  return updated;
}

// -------------------------------------------------------------
// COMPATIBILITY ALIASES
// -------------------------------------------------------------
export const getDeviceMedia = getMedia;
export const addCapturedMedia = addMedia;
export function clearDeviceMedia(deviceId: string) {
  const list = getMediaStore();
  const filtered = list.filter(m => m.device_id !== deviceId);
  global.__fleetMedia = filtered;
  persistDb();
}

export const getDeviceLocationHistory = getLocationHistory;
export function clearDeviceLocationHistory(deviceId: string) {
  const store = getLocationHistoryStore();
  store.delete(deviceId);
  persistDb();
}

export const getDeviceAuditLogs = getAuditLogs;
export function clearDeviceAuditLogs(deviceId: string) {
  const list = getAuditLogsStore();
  const filtered = list.filter(l => l.device_id !== deviceId);
  global.__fleetAuditLogs = filtered;
  persistDb();
}

export interface DownloadFilePayload {
  device_id: string;
  filename: string;
  mime_type: string;
  target_path: string;
  data_url: string;
  size_bytes: number;
  is_folder: boolean;
  timestamp: number;
}

declare global {
  var __fleetDownloads: Map<string, DownloadFilePayload> | undefined;
}

function getDownloadsStore(): Map<string, DownloadFilePayload> {
  if (!global.__fleetDownloads) {
    global.__fleetDownloads = new Map<string, DownloadFilePayload>();
  }
  return global.__fleetDownloads;
}

export function saveDownloadedFile(payload: DownloadFilePayload) {
  const store = getDownloadsStore();
  store.set(payload.device_id, payload);
}

export function getLatestDownloadedFile(deviceId: string): DownloadFilePayload | null {
  const store = getDownloadsStore();
  return store.get(deviceId) || null;
}

export function clearDownloadedFile(deviceId: string) {
  const store = getDownloadsStore();
  store.delete(deviceId);
}

export const getDeviceApps = getApps;
export const getDeviceInstalledApps = getApps;
export const updateInstalledApps = updateApps;
export const updateDeviceApps = updateApps;

export function ackCommandResult(commandId: string, status: string, result?: any) {
  const normalizedStatus: RemoteCommand['status'] =
    status === 'SUCCESS' || status === 'COMPLETED' || status === 'EXECUTED'
      ? 'EXECUTED'
      : 'FAILED';
  updateCommandStatus(commandId, normalizedStatus, result);
}

export const getDeviceFiles = getFiles;
export const updateDeviceFiles = updateFiles;


export const getDeviceIntelligence = getIntelligence;
export const updateDeviceIntelligence = updateIntelligence;
export const getIntelligenceHubState = getIntelligence;
export const updateIntelligenceHubState = updateIntelligence;




// -------------------------------------------------------------
// LIVE SCREEN STREAM STORE (Disk-Persisted for Multi-Instance Vercel)
// -------------------------------------------------------------
interface StreamFrame {
  data_url: string;
  timestamp: number;
}

const STREAM_DIR = path.join(process.cwd(), 'data', 'streams');

function ensureStreamDir() {
  try {
    if (!fs.existsSync(STREAM_DIR)) {
      fs.mkdirSync(STREAM_DIR, { recursive: true });
    }
  } catch {}
}

function getStreamFramesStore(): Map<string, StreamFrame> {
  if (!global.__fleetStreamFrames) {
    global.__fleetStreamFrames = new Map<string, StreamFrame>();
  }
  return global.__fleetStreamFrames;
}

export function saveStreamFrame(deviceId: string, dataUrl: string) {
  const frame: StreamFrame = { data_url: dataUrl, timestamp: Date.now() };
  getStreamFramesStore().set(deviceId, frame);

  // Redis varsa TTL'li tek key + pub/sub — çok-instance için gerçek kaynak burası.
  try {
    // Lazy import: build-time cycle olmasın.

    if (redis) {
      const key = `dev:${deviceId}:frame`;
      redis.set(key, JSON.stringify(frame), "EX", 10).catch(() => {});
      redis.publish(`dev:${deviceId}:frame`, String(frame.timestamp)).catch(() => {});
    }
  } catch {}

  try {
    const store = getDeviceStore();
    const dev = store.get(deviceId);
    if (dev) {
      dev.last_seen_at = Date.now();
      dev.is_online = true;
    }
  } catch {}
}

export function getStreamFrame(deviceId: string): StreamFrame | null {
  // Bloklayan disk okumasını kaldırdık; process-local RAM tek kaynak.
  // Multi-instance senaryoda Redis fallback için async getStreamFrameAsync kullan.
  return getStreamFramesStore().get(deviceId) || null;
}

export async function getStreamFrameAsync(deviceId: string): Promise<StreamFrame | null> {
  const mem = getStreamFramesStore().get(deviceId);
  if (mem) return mem;
  try {

    if (redis) {
      const raw = await redis.get(`dev:${deviceId}:frame`);
      if (raw) {
        const frame = JSON.parse(raw) as StreamFrame;
        getStreamFramesStore().set(deviceId, frame);
        return frame;
      }
    }
  } catch {}
  return null;
}

// -------------------------------------------------------------
// WEBRTC SIGNALING STORE (Disk-Persisted for Multi-Instance Vercel)
// -------------------------------------------------------------
export interface WebRtcSignal {
  id: string;
  type: 'offer' | 'answer' | 'ice-candidate' | 'reset';
  sdp?: string;
  candidate?: any;
  sender: 'browser' | 'device';
  timestamp: number;
}

const SIGNALS_DIR = path.join(process.cwd(), 'data', 'signals');

function ensureSignalsDir() {
  try {
    if (!fs.existsSync(SIGNALS_DIR)) {
      fs.mkdirSync(SIGNALS_DIR, { recursive: true });
    }
  } catch {}
}

function getWebRtcSignalsStore(): Map<string, WebRtcSignal[]> {
  if (!global.__fleetWebRtcSignals) {
    global.__fleetWebRtcSignals = new Map<string, WebRtcSignal[]>();
  }
  return global.__fleetWebRtcSignals;
}

function loadSignalsFromDisk(deviceId: string): WebRtcSignal[] {
  try {
    ensureSignalsDir();
    const filePath = path.join(SIGNALS_DIR, `${deviceId}.json`);
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      if (raw.trim()) {
        const list = JSON.parse(raw) as WebRtcSignal[];
        const now = Date.now();
        return list.filter(s => now - s.timestamp < 120000);
      }
    }
  } catch {}
  return [];
}

function persistSignalsToDisk(deviceId: string, signals: WebRtcSignal[]) {
  // Sync disk yazımı kaldırıldı — sinyaller RAM'de tutulur + Pusher üzerinden yayınlanır (Faz 2).
  // Multi-instance için Redis TTL 60s kullan:
  try {

    if (redis) {
      redis
        .set(`dev:${deviceId}:signals`, JSON.stringify(signals), "EX", 60)
        .catch(() => {});
    }
  } catch {}
}

export function saveWebRtcSignal(deviceId: string, signal: Omit<WebRtcSignal, 'id' | 'timestamp'>) {
  const store = getWebRtcSignalsStore();
  let queue = store.get(deviceId) || [];
  
  if (signal.type === 'reset') {
    store.set(deviceId, []);
    return;
  }

  const newSignal: WebRtcSignal = {
    ...signal,
    id: `sig_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: Date.now()
  };

  queue.push(newSignal);
  if (queue.length > 50) queue.shift();
  store.set(deviceId, queue);
}

export function getWebRtcSignals(deviceId: string, recipient: 'browser' | 'device', sinceTimestamp: number = 0): WebRtcSignal[] {
  const store = getWebRtcSignalsStore();
  const queue = store.get(deviceId) || [];
  const targetSender = recipient === 'browser' ? 'device' : 'browser';
  return queue.filter(s => s.sender === targetSender && s.timestamp > sinceTimestamp);
}

export function clearWebRtcSignals(deviceId: string) {
  const store = getWebRtcSignalsStore();
  store.delete(deviceId);
}
