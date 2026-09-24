import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;

const globalForDb = globalThis as unknown as {
  __pgClient?: ReturnType<typeof postgres>;
};

// Tekil client — dev/HMR her save'de yeni connection açmasın; prod'da pool paylaşımı.
export const client =
  globalForDb.__pgClient ??
  postgres(connectionString, {
    prepare: false, // Supabase/Neon transaction pool uyumu
    max: Number(process.env.PG_POOL_MAX ?? 10),
    idle_timeout: Number(process.env.PG_IDLE_TIMEOUT ?? 30),
    connect_timeout: Number(process.env.PG_CONNECT_TIMEOUT ?? 10),
    max_lifetime: 60 * 30,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__pgClient = client;
}

export const db = drizzle(client, { schema });
