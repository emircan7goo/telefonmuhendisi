import { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq, or, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { ProductDetailClient } from "./ProductDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProduct(slugOrId: string) {
  try {
    const isNumeric = /^\d+$/.test(slugOrId);
    const result = await db
      .select()
      .from(products)
      .where(
        isNumeric
          ? or(eq(products.slug, slugOrId), eq(products.id, parseInt(slugOrId, 10)))
          : eq(products.slug, slugOrId)
      )
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.warn("[getProduct] DB query failed:", (error as Error).message);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "Ürün Bulunamadı | Telefon Mühendisi",
    };
  }

  const desc = product.description || `${product.name} orijinal ve garantili olarak Telefon Mühendisi'nde. En uygun fiyat ve hızlı teslimat avantajıyla hemen satın alın.`;

  return {
    title: `${product.name} | Telefon Mühendisi`,
    description: desc,
    alternates: {
      canonical: `https://telefonmuhendisi.com/urunler/${product.slug || product.id}`,
    },
    openGraph: {
      title: product.name,
      description: desc,
      images: Array.isArray(product.images) && product.images.length > 0 
        ? [product.images[0]] 
        : ["https://telefonmuhendisi.com/og-image.jpg"],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
