"use client";

export function CartProvider({ children }: { children: React.ReactNode }) {
  // CartProvider is a thin wrapper — Zustand handles state globally.
  // This component exists for future context additions (e.g. optimistic updates, server sync).
  return <>{children}</>;
}
