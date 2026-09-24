// Sunucu ve istemci ortak kanal adları. "private-" öneki Pusher'ın her abonelik
// için /api/pusher/auth üzerinden yetki istemesini zorunlu kılar.
export const REPAIR_CHANNEL_PREFIX = "private-repair-";

export function repairChannel(repairId: number): string {
  return `${REPAIR_CHANNEL_PREFIX}${repairId}`;
}
