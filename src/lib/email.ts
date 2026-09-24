/** E-posta ve şifre kuralları. Saf modül: client component'lerden de import edilebilir. */

/** E-postalar her yerde bu biçimde saklanır ve karşılaştırılır. */
export function normalizeEmail(email: string | null | undefined): string {
  return (email ?? "").trim().toLowerCase();
}

export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 72; // bcrypt 72 bayttan sonrasını yok sayar
