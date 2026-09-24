import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY || "re_test_123456");

export async function sendOrderConfirmationEmail(email: string, orderId: number, total: string) {
  try {
    await resend.emails.send({
      from: "Telefon Mühendisi <siparis@telefonmuhendisi.com>", // You must verify your domain in Resend
      to: email,
      subject: `Siparişiniz Onaylandı #${orderId}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Siparişiniz Alındı!</h2>
          <p>Değerli Müşterimiz,</p>
          <p><strong>#${orderId}</strong> numaralı siparişiniz başarıyla alınmıştır.</p>
          <p>Toplam Tutar: <strong>${total} ₺</strong></p>
          <p>Sipariş detaylarınızı <a href="http://localhost:3001/hesabim">hesabım</a> sayfasından takip edebilirsiniz.</p>
          <br/>
          <p>Telefon Mühendisi Ekibi</p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { success: false, error };
  }
}

export async function sendRepairStatusEmail(email: string, repairId: number, status: string, deviceModel: string) {
  try {
    const statusText: Record<string, string> = {
      pending: "Cihaz Bekleniyor",
      in_progress: "Arıza Tespiti / Onarım Aşamasında",
      completed: "Tamamlandı (Teslime Hazır)",
      cancelled: "İptal Edildi"
    };

    await resend.emails.send({
      from: "Telefon Mühendisi <servis@telefonmuhendisi.com>",
      to: email,
      subject: `Tamir Süreciniz Güncellendi (Kayıt: REP-${repairId})`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Cihazınızın Durumu Güncellendi</h2>
          <p>Değerli Müşterimiz,</p>
          <p><strong>${deviceModel}</strong> model cihazınızın servis durumu güncellenmiştir.</p>
          <p>Yeni Durum: <strong>${statusText[status] || status}</strong></p>
          <p>Tamir sürecinizi <a href="https://telefonmuhendisi.com/takip">Takip sayfamızdan</a> (REP-${repairId}) koduyla kontrol edebilirsiniz.</p>
          <br/>
          <p>Telefon Mühendisi Servis Ekibi</p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { success: false, error };
  }
}
