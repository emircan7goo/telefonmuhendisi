import { requireAdminPage } from "@/lib/authz";

// Bu bölüm sadece admin'e açık; teknisyen ana ekrana yönlendirilir.
export default async function AdminOnlyLayout({ children }: { children: React.ReactNode }) {
  await requireAdminPage();
  return <>{children}</>;
}
