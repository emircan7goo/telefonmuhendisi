import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Güvenlik: Test uçlarını kesinlikle 404 döndür
  if (pathname.startsWith("/api/test-env") || pathname.startsWith("/api/v1")) {
    return new NextResponse(null, { status: 404 });
  }

  // Admin paneli koruması (/tmkontrols)
  if (pathname.startsWith("/tmkontrols") && !pathname.startsWith("/tmkontrols-giris")) {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET,
    });
    const role = (token as any)?.role;

    if (!token || !["admin", "technician"].includes(role)) {
      const url = req.nextUrl.clone();
      url.pathname = "/tmkontrols-giris";
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/tmkontrols/:path*",
    "/api/test-env/:path*",
    "/api/v1/:path*",
  ],
};
