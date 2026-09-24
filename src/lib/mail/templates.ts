import { escapeHtml } from "@/lib/mail";

export const EMAIL_COLORS = {
  primary: "#2563eb",
  bg: "#f8fafc",
  text: "#0f172a",
  lightText: "#64748b",
};

export const getRepairCreatedEmailHtml = (userName: string, deviceName: string, issueName: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: ${EMAIL_COLORS.bg}; color: ${EMAIL_COLORS.text}; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; padding: 40px; border-radius: 16px; border: 1px solid #e2e8f0; }
    .header { text-align: center; margin-bottom: 30px; }
    .header h1 { color: ${EMAIL_COLORS.primary}; margin: 0; font-size: 24px; }
    .content { line-height: 1.6; }
    .box { background: ${EMAIL_COLORS.bg}; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #e2e8f0; }
    .btn { display: inline-block; padding: 14px 28px; background-color: ${EMAIL_COLORS.primary}; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px; }
    .footer { text-align: center; margin-top: 40px; color: ${EMAIL_COLORS.lightText}; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📱 Telefon Mühendisi</h1>
    </div>
    <div class="content">
      <h2>Merhaba ${escapeHtml(userName)},</h2>
      <p>Cihazınız için onarım talebiniz başarıyla alınmıştır. Teknik ekibimiz en kısa sürede bilgileri inceleyecek ve size bir fiyat teklifi sunacaktır.</p>
      
      <div class="box">
        <strong>Cihaz:</strong> ${escapeHtml(deviceName)}<br>
        <strong>Arıza:</strong> ${escapeHtml(issueName)}
      </div>

      <p>Cihazınızın durumunu müşteri panelinizden canlı olarak takip edebilirsiniz.</p>
      
      <div style="text-align: center;">
        <a href="https://telefonmuhendisi.com/profil" class="btn">Talebi Görüntüle</a>
      </div>
    </div>
    <div class="footer">
      © ${new Date().getFullYear()} Telefon Mühendisi. Tüm hakları saklıdır.<br>
      Karamürsel / Kocaeli
    </div>
  </div>
</body>
</html>
`;

export const getRepairStatusUpdatedEmailHtml = (userName: string, deviceName: string, statusName: string, note?: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: ${EMAIL_COLORS.bg}; color: ${EMAIL_COLORS.text}; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; padding: 40px; border-radius: 16px; border: 1px solid #e2e8f0; }
    .header { text-align: center; margin-bottom: 30px; }
    .header h1 { color: ${EMAIL_COLORS.primary}; margin: 0; font-size: 24px; }
    .content { line-height: 1.6; }
    .status-badge { display: inline-block; padding: 8px 16px; background-color: #dbeafe; color: #1e40af; border-radius: 9999px; font-weight: bold; font-size: 14px; margin: 10px 0; }
    .note-box { background: #fef3c7; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #fde68a; color: #92400e; font-style: italic; }
    .btn { display: inline-block; padding: 14px 28px; background-color: ${EMAIL_COLORS.primary}; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px; }
    .footer { text-align: center; margin-top: 40px; color: ${EMAIL_COLORS.lightText}; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📱 Telefon Mühendisi</h1>
    </div>
    <div class="content">
      <h2>Merhaba ${escapeHtml(userName)},</h2>
      <p><strong>${escapeHtml(deviceName)}</strong> cihazınızın onarım durumunda bir güncelleme var.</p>
      
      <p>Yeni Durum: <span class="status-badge">${escapeHtml(statusName)}</span></p>

      ${note ? `
      <div class="note-box">
        <strong>Teknisyen Notu:</strong><br>
        "${escapeHtml(note)}"
      </div>
      ` : ''}

      <p>Müşteri panelinizden cihazınızın tüm detaylarına ulaşabilirsiniz.</p>
      
      <div style="text-align: center;">
        <a href="https://telefonmuhendisi.com/profil" class="btn">Detayları Gör</a>
      </div>
    </div>
    <div class="footer">
      © ${new Date().getFullYear()} Telefon Mühendisi. Tüm hakları saklıdır.<br>
      Karamürsel / Kocaeli
    </div>
  </div>
</body>
</html>
`;
