"use server";

import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

// Güvenlik: Sadece yetkili personelin erişimini sağlar
const checkAdmin = async () => {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    throw new Error("Yetkisiz erişim: Bu işlem için Admin yetkisi gereklidir.");
  }
};

export async function toggleProductStatus(productId: number, isActive: boolean) {
  await checkAdmin();
  try {
    await db.update(products)
      .set({ isActive, updatedAt: new Date() })
      .where(eq(products.id, productId));
    revalidatePath("/tmkontrols/urunler");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateProductStock(productId: number, newStock: number) {
  await checkAdmin();
  try {
    await db.update(products)
      .set({ stock: newStock, updatedAt: new Date() })
      .where(eq(products.id, productId));
    revalidatePath("/tmkontrols/urunler");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteProduct(productId: number) {
  await checkAdmin();
  try {
    await db.delete(products).where(eq(products.id, productId));
    revalidatePath("/tmkontrols/urunler");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Ürün silinirken hata oluştu (Siparişlerle bağlantılı olabilir)." };
  }
}

export async function createRealProduct(data: {
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  stock: number;
  brand: string;
  category: string;
  condition: string;
  image: string;
}) {
  await checkAdmin();
  try {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Math.floor(Math.random() * 1000);
    
    await db.insert(products).values({
      name: data.name,
      slug: slug,
      description: data.description,
      price: data.price,
      originalPrice: data.originalPrice || data.price,
      stock: data.stock,
      brand: data.brand,
      condition: data.condition,
      images: [data.image],
      features: { category: data.category },
      isActive: true,
    });
    
    revalidatePath("/tmkontrols/urunler");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
