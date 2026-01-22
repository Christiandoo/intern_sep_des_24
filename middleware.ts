import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  /* =========================
     1. PROTEKSI DASHBOARD
     ========================= */
  if (pathname.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(
      new URL("/auth/login", request.url)
    );
  }

  /* =========================
     2. PROTEKSI ADMIN AREA
     ========================= */
  if (pathname.startsWith("/admin")) {
    // belum login
    if (!token) {
      return NextResponse.redirect(
        new URL("/auth/login", request.url)
      );
    }

    // bukan admin
    if (token.role !== "admin") {
      return NextResponse.redirect(
        new URL("/dashboard", request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
