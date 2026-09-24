import { MetadataRoute } from 'next';
import { DEVICE_DATABASE } from '@/data/devices';

export default function sitemap(): MetadataRoute.Sitemap {
  // Always use the real domain in production to prevent localhost URLs in sitemap
  const baseUrl = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000' 
    : 'https://telefonmuhendisi.com';

  // Not: /urunler/[slug] detay sayfası henüz yok — ürün URL'leri eklenirse 404 verir.
  // Detay sayfası yapılınca ürünler buraya geri eklenecek.

  // 2. Static Routes
  const staticUrls = [
    '',
    '/urunler',
    '/tamir',
    '/cihaz-sat',
    '/kurumsal',
    '/takip',
    '/sss'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.9,
  }));

  // 3. Dynamic Repair Routes (Every Brand & Model in the DB)
  const repairUrls: MetadataRoute.Sitemap = [];
  
  DEVICE_DATABASE.forEach((brand) => {
    // Add brand page itself if we had one, but we use /tamir/[brand]/[model]
    brand.models.filter((m) => !m.id.endsWith('_diger')).forEach((model) => {
      repairUrls.push({
        url: `${baseUrl}/tamir/${brand.id}/${model.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8, // Repair pages are highly important
      });
    });
  });

  return [...staticUrls, ...repairUrls];
}
