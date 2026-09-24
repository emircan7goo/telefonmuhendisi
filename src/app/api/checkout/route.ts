import { NextResponse } from "next/server";
import { initializeCheckoutForm } from "@/lib/iyzico";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { cartItems, totalAmount, shippingAddress, billingAddress } = await req.json();

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Prepare Iyzico Request
    const request = {
      locale: "TR",
      conversationId: `order_${Date.now()}`,
      price: totalAmount.toString(),
      paidPrice: totalAmount.toString(),
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
      basketItems: cartItems.map((item: any) => ({
        id: item.productId.toString(),
        name: item.name,
        category1: "Elektronik",
        itemType: "PHYSICAL",
        price: (item.price * item.quantity).toString()
      }))
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
