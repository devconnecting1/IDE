import { type NextRequest, NextResponse } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard", "/chat", "/mail"] as const;
const PUBLIC_PREFIXES = ["/auth", "/docs"] as const;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = request.cookies.has("demo-auth");
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix)) || pathname === "/";
  const isPublic = PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (isProtected && !isAuthenticated) {
    return NextResponse.redirect(new URL("/auth/v2/login", request.url));
  }

  if (isPublic && isAuthenticated && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/dashboard/default", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
