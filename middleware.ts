import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("smartpark_session");

  if (
    !session &&
    request.nextUrl.pathname.startsWith("/dashboard")
  ) {
    return NextResponse.redirect(new URL("/users", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/vehicles/:path*",
    "/vehicle-types/:path*",
    "/parking-slots/:path*",
    "/parking-records/:path*",
    "/users/:path*",
    "/reports/:path*",
    "/settings/:path*",
  ],
};