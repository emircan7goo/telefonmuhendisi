/**
 * Faz 4.20 — Sentry SDK opt-in noshim.
 *
 * Sentry paketleri (@sentry/nextjs) yüklendiğinde ve SENTRY_DSN env varsa
 * `initSentry()` çağrısı gerçek init yapar; aksi halde no-op.
 *
 * Bu şekilde çekirdek bağımlılık listesi büyümez; ekip Sentry'i açtığında:
 *   npm i @sentry/nextjs
 *   SENTRY_DSN=... npm run build
 */

let initialized = false;

export async function initSentry(): Promise<void> {
  if (initialized) return;
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return;

  try {
    // Modül string'ini variable yaparak tsc'nin çözmesini engelliyoruz;
    // @sentry/nextjs yüklü değilse hata catch bloğuna düşer.
    const pkg = "@sentry/nextjs";
    const Sentry: any = await import(/* @vite-ignore */ pkg).catch(() => null);
    if (!Sentry) {
      console.info("[observability] SENTRY_DSN var ama @sentry/nextjs yüklü değil. `npm i @sentry/nextjs`");
      return;
    }
    Sentry.init({
      dsn,
      environment: process.env.NODE_ENV,
      tracesSampleRate: Number(process.env.SENTRY_TRACES_RATE ?? 0.1),
      release: process.env.APP_VERSION,
    });
    initialized = true;
    console.info("[observability] Sentry initialized");
  } catch (e) {
    console.warn("[observability] Sentry init failed:", (e as Error).message);
  }
}

export function captureException(err: unknown, ctx?: Record<string, any>): void {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return;
  const pkg = "@sentry/nextjs";
  // Lazy fire-and-forget; paket yoksa sessiz geç
  import(/* @vite-ignore */ pkg)
    .then((Sentry: any) => Sentry.captureException(err, { extra: ctx }))
    .catch(() => {});
}
