import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Docker prod imajını küçültür (~600MB → ~150MB) — Dockerfile bunu bekliyor.
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  // Node-native paketler (server component'lerde import edilir) build'e girmesin
  serverExternalPackages: ["iyzipay", "ioredis", "pusher", "postgres", "@aws-sdk/client-s3", "@aws-sdk/s3-request-presigner"],
  // Aşamalı temizlik: STRICT_BUILD=true iken TS/ESLint hataları build'i keser (CI'da).
  eslint: {
    ignoreDuringBuilds: process.env.STRICT_BUILD !== "true",
  },
  typescript: {
    ignoreBuildErrors: process.env.STRICT_BUILD !== "true",
  },
  allowedDevOrigins: ["*.trycloudflare.com", "adjustment-endif-workers-must.trycloudflare.com", "localhost:3000", "127.0.0.1:3000"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(self), microphone=(self), geolocation=(self), interest-cohort=()" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "/tmkontrols",
        permanent: true,
      },
      {
        source: "/admin/:path*",
        destination: "/tmkontrols/:path*",
        permanent: true,
      },
      // Eski/kopya ve silinen URL'ler — ana sayfaya veya doğru adrese yönlendirildi
      { source: "/tmhackerz/:path*", destination: "/", permanent: true },
      { source: "/telefonmuhendisi/:path*", destination: "/", permanent: true },
      { source: "/dashboard/:path*", destination: "/", permanent: true },
      { source: "/tamir-takip", destination: "/takip", permanent: true },
      // www → apex (kopya içerik olmasın)
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.telefonmuhendisi.com" }],
        destination: "https://telefonmuhendisi.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default withPWA(nextConfig);
