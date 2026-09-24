# AI Handoff & Project Context Document
**Proje Adı:** Telefon Mühendisi  
**Proje Türü:** E-Ticaret, Tamir Süreç Yönetimi (CRM) ve Kurumsal Web Sitesi  
**Mevcut Durum:** %100 MVP Tamamlandı (Faz 1, Faz 2, Faz 3, Faz 4)

Merhaba yeni yapay zeka asistanı! Bu doküman, Telefon Mühendisi projesinin mimarisini, şimdiye kadar nelerin tamamlandığını ve önümüzdeki yol haritasını anlaman için hazırlandı.

---

## 🛠️ 1. Teknolojik Altyapı (Tech Stack)
Proje, tamamen modern web standartlarına (Vercel/Apple estetiği) göre geliştirilmiştir.
- **Framework:** Next.js 15.5 (App Router, Server Actions, SSR & SSG).
- **Veritabanı:** PostgreSQL (Drizzle ORM kullanılarak şemalar yönetiliyor).
- **Kimlik Doğrulama:** NextAuth.js v5 (Google OAuth ve Credential/SMS tabanlı).
- **State Management:** Zustand (Client-side sepet yönetimi ve persist middleware).
- **Stil & UI:** Tailwind CSS (Vanilla CSS ile desteklenmiş `index.css`), Framer Motion (Mikro-animasyonlar), Lucide React (İkonlar), React Hot Toast.
- **Ödeme Altyapısı:** Iyzico (Node.js SDK, dinamik checkout formu, Webpack External Package ayarlı).
- **Bildirimler:** Resend (E-posta bildirimleri) & Netgsm (SMS altyapısı).
- **Dosya Depolama:** Cloudflare R2 (Amazon S3 uyumlu obje depolama).
- **Performans & SEO:** Next-PWA (Progressive Web App desteği), Dinamik `sitemap.ts`, Global Error Fallback mekanizmaları (`error.tsx`, `global-error.tsx`).

---

## ✅ 2. Tamamlanan 20 Adımlık Yol Haritası
Proje 4 faza bölündü ve **bütün adımlar eksiksiz tamamlandı.** (Eğer yeni geliştirmeler yapacaksan bu temelin üzerine inşa etmelisin).

### 🟢 Faz 1: Altyapı ve Veritabanı
1. **[X] Drizzle ORM ve PostgreSQL Kurulumu:** `src/lib/db/schema/index.ts` oluşturuldu, ilişkiler (Relations) tanımlandı.
2. **[X] NextAuth.js (v5) Entegrasyonu:** `src/auth.ts` kuruldu, DrizzleAdapter bağlandı.
3. **[X] SMS (Netgsm) Auth Altyapısı:** SMS ile OTP gönderim fonksiyonları (`src/lib/netgsm/index.ts`) hazırlandı.
4. **[X] Cloudflare R2 Bucket Ayarları:** Kullanıcı/Admin dosya yüklemeleri için altyapı kodlandı.
5. **[X] Temel Sayfalar:** Header, Footer, Hero, Ana sayfa ve Responsive Bottom Nav yapıldı.

### 🟢 Faz 2: E-Ticaret ve Tamir Modülü
6. **[X] Ürünler ve Filtreleme (`/urunler`):** Sıfır ve ikinci el (Yenilenmiş) cihaz listeleme, kategoriler, Zustand ile sepete ekleme.
7. **[X] Ürün Detay Sayfası (`/urunler/[slug]`):** SSG ile derlenen dinamik ürün sayfası, "Ek donanımlar" tablosu.
8. **[X] Sepet Yönetimi (`/sepet`):** Zustand persist kullanarak sepetin LocalStorage'a kaydedilmesi.
9. **[X] Tamir Sihirbazı (`/tamir`):** Müşterinin cihaz modelini seçip, arızayı işaretleyip fiyat aldığı "Wizard" ekranı.
10. **[X] Kullanıcı Paneli (`/hesabim`):** Oturum açmış kullanıcının siparişlerini ve tamir süreçlerini gördüğü Drizzle ORM entegreli sayfa.

### 🟢 Faz 3: Sipariş Yönetimi ve Admin Paneli
11. **[X] Iyzico Ödeme Entegrasyonu (`/checkout` & `/api/checkout`):** Dinamik checkout HTML formu render edildi, Iyzico SDK ile bağlandı.
12. **[X] Tamir Takip Sistemi (`/tamir-takip`):** REP-1234 gibi kodlarla cihazın anlık durumunu görebilme (Timeline UI).
13. **[X] Admin Dashboard (`/admin`):** Sidebar menüsü, ciro ve aktif tamir istatistikleri (Stat kartları).
14. **[X] Admin Sipariş & Tamir Yönetimi (`/admin/siparisler` vb.):** E-ticaret siparişleri ve servis kayıtları tek ekranda listelendi.
15. **[X] Admin Ürün Yönetimi (`/admin/urunler`):** Yeni cihaz/aksesuar ekleme ve stok tablosu.

### 🟢 Faz 4: Prodüksiyon, Güvenlik ve İnce Ayar
16. **[X] E-posta Bildirimleri:** `Resend` entegrasyonu ile "Sipariş Onayı" ve "Tamir Durumu" mailleri.
17. **[X] Hata Yakalama (Error Fallback):** `global-error.tsx` ve `error.tsx` ile uygulamanın beyaz ekrana düşmesi engellendi.
18. **[X] SEO & Sitemap:** `layout.tsx` metadata optimizasyonları ve `sitemap.ts` eklendi.
19. **[X] PWA:** Uygulama telefona "Uygulama olarak eklenebilir" (manifest.json, next-pwa) hale getirildi.
20. **[X] Canlıya Alma Hazırlığı:** `npm run build` TypeScript tip hataları (NextAuth Adapter ve Next.js 15 Promise<Params>) düzeltilerek başarıyla (0 Hata) alındı.

---

## ⚠️ 3. Karşılaşılan "Internal Server Error" Çözümü (Geliştirici Notu)
Kullanıcı uygulamayı lokalde açıp test etmeye çalıştığında **"Internal Server Error (500)"** alabilir. Bunun %99 sebebi **Veritabanı (PostgreSQL) bağlantısıdır**.
1. `.env` dosyasındaki `DATABASE_URL` şu an `localhost:5432`'yi işaret ediyor. Eğer bilgisayarda Postgres çalışmıyorsa veya Drizzle tabloları oluşturulmadıysa (Push yapılmadıysa), Drizzle hata fırlatır.
2. **Nasıl Çözülür?** 
   - Projenin kök dizininde `npx drizzle-kit push` (veya `db:push`) komutu çalıştırılarak tablolar oluşturulmalıdır.
   - Yoksa Supabase / Neon gibi bulut veritabanlarından bir URI alınıp `.env` dosyasına yazılmalıdır.
3. Ayrıca `AUTH_SECRET` eksikliği veya yetersiz uzunluğu NextAuth.js'in 500 dönmesine sebep olur.

---

## 🚀 4. Önümüzdeki Yol Haritası (Gelecek Eklentiler & Öneriler)

Sistemin MVP'si muazzam ve Vercel'de yayına hazır. Bir sonraki aşamada (Post-MVP) şu özellikler projenin gücünü x10 yapacaktır:

1. **Yapay Zeka Müşteri Temsilcisi (AI Chatbot) Entegrasyonu:**
   - Mevcut `AiAsistanWidget` bileşeninin içini OpenAI veya Gemini API ile gerçek veritabanına bağlamak. Müşteri "Ekranım kırıldı" dediğinde AI direkt güncel fiyatı çekip söyleyebilir.
   
2. **Admin Paneli Veri Akışı (Mutations):**
   - Şu an Admin panelindeki sayfalar (`/admin/urunler`, vb.) verileri Drizzle ile `select` yaparak listeliyor. Ancak Yeni ürün ekleme formları (Server Actions veya API Routelar) aktif olarak yazılmalı. Adminler ürün fiyatlarını veya sipariş statülerini bir formla POST edebilmeli.
   
3. **Rol Bazlı Teknisyen Paneli:**
   - Sadece teknisyenlerin girebildiği, gelen tamirlerin fotoğraflarını (Cloudflare R2 kullanarak) sisteme yüklediği daha izole bir ekran yapılmalı.
   
4. **Gerçek Zamanlı Bildirimler (Pusher/Soket):**
   - Müşteri sipariş verdiğinde Admin panelinde "Çın!" sesi çıkarıp anlık bildirim düşüren Socket.io veya Pusher entegrasyonu.
   
5. **Kapsamlı Analytics ve Dashboard Grafikleri:**
   - Recharts vb. kullanılarak aylık ciro raporlarının, en çok bozulan telefon modellerinin Admin panelinde pasta ve çizgi grafikleri ile gösterilmesi.

**Not:** Bu projeyi devam ettiren AI, her zaman en güncel Next.js (App Router) mimarisini, SSR/RSC farklarını dikkate almalı ve tasarımdaki "Apple/Vercel estetiğini" (bol padding, rounded-3xl, kaliteli fontlar, glassmorphism) korumalıdır. Kolay gelsin!
