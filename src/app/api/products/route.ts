import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { and, desc, eq, sql } from "drizzle-orm";

export const revalidate = 300;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paginated = searchParams.get("paginated") === "1";
    const limit = Math.min(Number(searchParams.get("limit") ?? (paginated ? 24 : 500)), 500);
    const offset = Math.max(Number(searchParams.get("offset") ?? 0), 0);
    const categoryId = searchParams.get("categoryId");
    const includeInactive = searchParams.get("includeInactive") === "1";
    const full = searchParams.get("full") === "1";

    const filters = [] as any[];
    if (!includeInactive) filters.push(eq(products.isActive, true));
    if (categoryId) filters.push(eq(products.categoryId, Number(categoryId)));
    const where = filters.length ? and(...filters) : undefined;

    const columns = full
      ? undefined
      : {
          id: true as const,
          name: true as const,
          slug: true as const,
          description: true as const,
          price: true as const,
          originalPrice: true as const,
          stock: true as const,
          categoryId: true as const,
          brand: true as const,
          condition: true as const,
          images: true as const,
          isActive: true as const,
          createdAt: true as const,
          updatedAt: true as const,
        };

    const rows = await db.query.products.findMany({
      where,
      columns,
      orderBy: [desc(products.createdAt)],
      limit,
      offset,
    });

    // Vitrin verisi CDN'de 5 dk tutulur, arka planda 1 gün boyunca eskisi sunulur
    // (veritabanı trafiğini düşürür). Admin istekleri (inactive/full) önbelleğe alınmaz.
    const headers = {
      "Cache-Control": includeInactive || full
        ? "private, no-store"
        : "public, s-maxage=300, stale-while-revalidate=86400",
    };

    if (!paginated) {
      return NextResponse.json(rows, { headers });
    }

    const totalRow: any = await db.execute(
      sql`select count(*)::int as count from ${products} ${where ? sql`where ${where}` : sql``}`,
    );
    const total = Number(totalRow?.[0]?.count ?? totalRow?.rows?.[0]?.count ?? rows.length);

    return NextResponse.json({ items: rows, total, limit, offset }, { headers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
