import { MetadataRoute } from 'next';
import { eq } from 'drizzle-orm';
import { DEVICE_DATABASE } from '@/data/devices';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000' 
    : 'https://telefonmuhendisi.com';

  // 1. Static Routes
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

  // 2. Dynamic Repair Routes (Every Brand & Model in the DB)
  const repairUrls: MetadataRoute.Sitemap = [];
  
  DEVICE_DATABASE.forEach((brand) => {
    brand.models.filter((m) => !m.id.endsWith('_diger')).forEach((model) => {
      repairUrls.push({
        url: `${baseUrl}/tamir/${brand.id}/${model.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      });
    });
  });

  // 3. Dynamic Product Routes
  const productUrls: MetadataRoute.Sitemap = [];
  try {
    const activeProducts = await db
      .select({ id: products.id, slug: products.slug, updatedAt: products.updatedAt })
      .from(products)
      .where(eq(products.isActive, true));

    for (const p of activeProducts) {
      productUrls.push({
        url: `${baseUrl}/urunler/${p.slug || p.id}`,
        lastModified: p.updatedAt || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      });
    }
  } catch {
    // DB çevrimdışıysa sitemap'in çökmesini engelle
  }

  return [...staticUrls, ...repairUrls, ...productUrls];
}
