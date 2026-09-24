import * as dotenv from "dotenv";
dotenv.config();
import { db } from "./src/lib/db";
import { coupons } from "./src/lib/db/schema";

async function seed() {
  await db.insert(coupons).values([
    {
      code: "INDIRIM10",
      discountType: "percent",
      discountValue: "10.00",
      isActive: true,
      usageLimit: null
    },
    {
      code: "HOSGELDIN",
      discountType: "fixed",
      discountValue: "100.00",
      isActive: true,
      usageLimit: 100
    }
  ]);
  console.log("Coupons seeded!");
  process.exit(0);
}

seed();
