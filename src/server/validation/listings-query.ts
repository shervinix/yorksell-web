import { NextResponse } from "next/server";
import { z } from "zod";

const ALLOWED_KEYS = new Set([
  "q",
  "minPrice",
  "maxPrice",
  "beds",
  "baths",
  "dens",
  "propertyType",
  "city",
  "status",
  "swLat",
  "swLng",
  "neLat",
  "neLng",
  "page",
  "limit",
  "sort",
]);

function disallowedQueryKey(searchParams: URLSearchParams): string | null {
  for (const k of new Set(searchParams.keys())) {
    if (!ALLOWED_KEYS.has(k)) return k;
  }
  return null;
}

const listingQuerySchema = z.object({
  q: z.string().max(200),
  minPrice: z.string().max(24),
  maxPrice: z.string().max(24),
  beds: z.array(z.string().max(8)).max(25),
  baths: z.array(z.string().max(8)).max(25),
  dens: z.array(z.string().max(8)).max(25),
  propertyType: z.string().max(120),
  city: z.string().max(120),
  status: z.string().max(80),
  swLat: z.string().max(24),
  swLng: z.string().max(24),
  neLat: z.string().max(24),
  neLng: z.string().max(24),
  page: z.coerce.number().int().min(1).max(10_000),
  limit: z.coerce.number().int().min(1).max(100),
  sort: z.enum(["price_asc", "price_desc", "updated_desc"]),
});

export type ValidatedListingQuery = z.infer<typeof listingQuerySchema>;

export function parseListingsQuery(
  req: Request
): { ok: true; query: ValidatedListingQuery } | { ok: false; response: NextResponse } {
  const url = new URL(req.url);
  const bad = disallowedQueryKey(url.searchParams);
  if (bad) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: `Unknown query parameter: ${bad}` },
        { status: 400 }
      ),
    };
  }

  const sp = url.searchParams;
  const raw = {
    q: (sp.get("q") ?? "").trim(),
    minPrice: sp.get("minPrice") ?? "",
    maxPrice: sp.get("maxPrice") ?? "",
    beds: sp.getAll("beds").map((b) => b.trim()).filter(Boolean),
    baths: sp.getAll("baths").map((b) => b.trim()).filter(Boolean),
    dens: sp.getAll("dens").map((d) => d.trim()).filter(Boolean),
    propertyType: (sp.get("propertyType") ?? "").trim(),
    city: (sp.get("city") ?? "").trim(),
    status: (sp.get("status") ?? "").trim(),
    swLat: sp.get("swLat") ?? "",
    swLng: sp.get("swLng") ?? "",
    neLat: sp.get("neLat") ?? "",
    neLng: sp.get("neLng") ?? "",
    page: sp.get("page") ?? "1",
    limit: sp.get("limit") ?? "24",
    sort: sp.get("sort") ?? "price_desc",
  };

  const parsed = listingQuerySchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Invalid query parameters." },
        { status: 400 }
      ),
    };
  }

  return { ok: true, query: parsed.data };
}
