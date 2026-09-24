/**
 * Next.js instrumentation hook — server start'ta bir kez çalışır.
 * Sentry / OTel init'ini burada tetikliyoruz.
 */
export async function register() {
  const { initSentry } = await import("./src/lib/observability");
  await initSentry();
}
