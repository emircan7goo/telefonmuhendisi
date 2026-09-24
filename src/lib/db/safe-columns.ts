/**
 * İlişkili `users` satırı çekilirken kullanılacak güvenli kolon setleri.
 * `with: { user: true }` passwordHash dahil tüm satırı döndürür — ASLA kullanma.
 */
export const publicUserColumns = {
  id: true,
  name: true,
  role: true,
} as const;

export const contactUserColumns = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
} as const;
