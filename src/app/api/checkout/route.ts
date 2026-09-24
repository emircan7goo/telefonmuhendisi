import { NextResponse } from "next/server";
import { initializeCheckoutForm } from "@/lib/iyzico";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { fromKurus, toKurus } from "@/lib/orders/pricing";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { cartItems, shippingAddress, billingAddress } = await req.json();

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Tutarlar istemciden alınmaz: sepet veritabanındaki güncel fiyatlarla hesaplanır.
    const quantities = new Map<number, number>();
    for (const item of cartItems) {
      const productId = Number(item?.productId);
      const quantity = Number(item?.quantity);
      if (!Number.isInteger(productId) || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
        return NextResponse.json({ error: "Invalid cart item" }, { status: 400 });
      }
      quantities.set(productId, (quantities.get(productId) ?? 0) + quantity);
    }

    const dbProducts = await db
      .select({ id: products.id, name: products.name, price: products.price, stock: products.stock })
      .from(products)
      .where(and(inArray(products.id, [...quantities.keys()]), eq(products.isActive, true)));

    if (dbProducts.length !== quantities.size || dbProducts.some((p) => p.stock < quantities.get(p.id)!)) {
      return NextResponse.json({ error: "Sepetteki bazı ürünler satışta değil veya stokta yok." }, { status: 409 });
    }

    const basketItems = dbProducts.map((p) => ({
      id: p.id.toString(),
      name: p.name,
      category1: "Elektronik",
      itemType: "PHYSICAL",
      price: fromKurus(toKurus(p.price) * quantities.get(p.id)!),
    }));
    const totalAmount = fromKurus(basketItems.reduce((sum, item) => sum + toKurus(item.price), 0));

    // Prepare Iyzico Request
    const request = {
      locale: "TR",
      conversationId: `order_${Date.now()}`,
      price: totalAmount,
      paidPrice: totalAmount,
      currency: "TRY",
      basketId: `basket_${Date.now()}`,
      paymentGroup: "PRODUCT",
      callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"}/api/checkout/callback`,
      enabledInstallments: [2, 3, 6, 9],
      buyer: {
        id: session.user.id,
        name: session.user.name?.split(" ")[0] || "Müşteri",
        surname: session.user.name?.split(" ").slice(1).join(" ") || "Soyadı",
        gsmNumber: "+905555555555", // Should come from user profile
        email: session.user.email || "musteri@example.com",
        identityNumber: "74300864791",
        lastLoginDate: "2026-06-10 12:00:00",
        registrationDate: "2026-06-01 12:00:00",
        registrationAddress: billingAddress.address,
        ip: "85.34.78.112", // Request IP
        city: billingAddress.city,
        country: "Turkey",
        zipCode: billingAddress.zipCode
      },
      shippingAddress: {
        contactName: session.user.name || "Müşteri",
        city: shippingAddress.city,
        country: "Turkey",
        address: shippingAddress.address,
        zipCode: shippingAddress.zipCode
      },
      billingAddress: {
        contactName: session.user.name || "Müşteri",
        city: billingAddress.city,
        country: "Turkey",
        address: billingAddress.address,
        zipCode: billingAddress.zipCode
      },
      basketItems
    };

    const result = await initializeCheckoutForm(request);

    if (result.status === "success") {
      return NextResponse.json({ 
        checkoutFormContent: result.checkoutFormContent,
        token: result.token,
        paymentPageUrl: result.paymentPageUrl
      });
    } else {
      return NextResponse.json({ error: result.errorMessage }, { status: 400 });
    }

  } catch (error) {
    console.error("Checkout Initialization Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
