import { NextResponse } from "next/server";
import { enforceRateLimit, RATE_LIMIT_PRESETS } from "@/server/rate-limit";
import { getFeaturedListings } from "@/lib/get-featured-listings";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const rl = enforceRateLimit(req, RATE_LIMIT_PRESETS.publicRead);
  if (rl) return rl;

  try {
    const listings = await getFeaturedListings();
    return NextResponse.json({ listings }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { message: "Failed to load featured listings", error: message },
      { status: 500 }
    );
  }
}