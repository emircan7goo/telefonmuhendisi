import { NextRequest, NextResponse } from 'next/server';
import { getAllFleetDevices } from '@/lib/fleetDb';
import { getAllDevices } from '@/lib/telemetryStore';

export const dynamic = 'force-dynamic';

// Ağır alanlar: dashboard list view'de gerekmez, opt-in `?fields=full` ile döner.
const HEAVY_FIELDS = new Set([
  'installed_apps',
  'files',
  'media',
  'audit_logs',
  'location_history',
  'intelligence',
  'apps',
]);

function projectDevice(d: any, mode: 'summary' | 'full'): any {
  if (mode === 'full') return d;
  const out: any = {};
  for (const k of Object.keys(d)) {
    if (!HEAVY_FIELDS.has(k)) out[k] = d[k];
  }
  return out;
}

function matchesQuery(d: any, q: string): boolean {
  const needle = q.toLowerCase();
  return (
    String(d.device_id || '').toLowerCase().includes(needle) ||
    String(d.model || '').toLowerCase().includes(needle) ||
    String(d.manufacturer || '').toLowerCase().includes(needle) ||
    String(d.serial_number || '').toLowerCase().includes(needle)
  );
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Math.max(Number(searchParams.get('limit') ?? 50), 1), 500);
    const cursor = Math.max(Number(searchParams.get('cursor') ?? 0), 0);
    const fields = (searchParams.get('fields') === 'full' ? 'full' : 'summary') as
      | 'summary'
      | 'full';
    const onlineFilter = searchParams.get('online'); // "true" | "false" | null
    const q = (searchParams.get('q') || '').trim();

    let devices: any[] = [];
    try {
      devices = await getAllFleetDevices();
    } catch {
      devices = getAllDevices();
    }

    const total = devices.length;
    const online = devices.filter((d) => d.is_online).length;

    if (onlineFilter === 'true') devices = devices.filter((d) => d.is_online);
    else if (onlineFilter === 'false') devices = devices.filter((d) => !d.is_online);
    if (q) devices = devices.filter((d) => matchesQuery(d, q));

    // En son görülene göre sırala
    devices.sort((a, b) => (b.last_seen_at ?? 0) - (a.last_seen_at ?? 0));

    const filtered = devices.length;
    const page = devices.slice(cursor, cursor + limit).map((d) => projectDevice(d, fields));
    const nextCursor = cursor + page.length < filtered ? cursor + page.length : null;

    return NextResponse.json(
      {
        status: 'success',
        // Backward compat: dashboard mevcut `devices` alanını kullanıyor
        devices: page,
        total_count: total,
        online_count: online,
        offline_count: total - online,
        filtered_count: filtered,
        limit,
        cursor,
        next_cursor: nextCursor,
        fields,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
        },
      },
    );
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error?.message }, { status: 500 });
  }
}
