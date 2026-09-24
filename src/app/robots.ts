import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000' 
    : 'https://telefonmuhendisi.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/', '/tmkontrols', '/tmkontrols-giris', '/dashboard', '/hesabim/', '/profil',
        '/sepet', '/checkout', '/tamir-onay', '/giris', '/kayit', '/sifremi-unuttum',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
