import { db } from "@/lib/db";
import { desc } from "drizzle-orm";
import { devicePurchases } from "@/lib/db/schema";
import CihazAlimClient from "./CihazAlimClient";

export default async function CihazAlimPage() {
  try {
    const requests = await db.query.devicePurchases.findMany({
      limit: 20,
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            email: true,
          }
        }
      },
      orderBy: [desc(devicePurchases.createdAt)],
    });

    return <CihazAlimClient requests={requests} />;
  } catch (error) {
    console.error(error);
    return (
      <div className="p-8 text-center text-rose-500 font-bold">
        Hata: Lütfen "npx drizzle-kit push" komutunu çalıştırdığınızdan emin olun. Veritabanı tabloları eksik.
      </div>
    );
  }
}
