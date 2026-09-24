import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminLoginForm from "./AdminLoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const session = await auth();

  // If already logged in as admin or technician, redirect straight to panel
  if (session?.user && ["admin", "technician"].includes((session.user as any).role)) {
    redirect("/tmkontrols");
  }

  return <AdminLoginForm />;
}
