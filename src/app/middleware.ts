// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const guestId = req.cookies.get("guestId");

  if (!guestId) {
    const response = NextResponse.next();
    response.cookies.set("guestId", crypto.randomUUID(), {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
    });
    return response;
  }

  return NextResponse.next();
}
