import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Minimal middleware (does nothing, but fixes Next.js error)
export function middleware(_req: NextRequest) {
  return NextResponse.next();
}

// Optional: run on all pages except Next internals
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};