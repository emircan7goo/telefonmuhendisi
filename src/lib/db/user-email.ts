import { sql } from "drizzle-orm";
import { users } from "@/lib/db/schema";
import { normalizeEmail } from "@/lib/email";

/**
 * Büyük/küçük harf duyarsız e-posta eşleşmesi. Normalizasyon öncesi
 * karışık harfle kaydedilmiş eski hesaplar da bulunur.
 */
export function userEmailEquals(email: string | null | undefined) {
  return sql`lower(${users.email}) = ${normalizeEmail(email)}`;
}
