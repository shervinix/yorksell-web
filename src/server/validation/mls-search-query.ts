import { NextResponse } from "next/server";
import { z } from "zod";

const ALLOWED = new Set(["q", "limit"]);

export function parseMlsSearchQuery(req: Request):
  | { ok: true; q: string; limit: number }
  | { ok: false; response: NextResponse } {
  const url = new URL(req.url);
  for (const k of new Set(url.searchParams.keys())) {
    if (!ALLOWED.has(k)) {
      return {
        ok: false,
        response: NextResponse.json(
          { error: `Unknown query parameter: ${k}` },
          { status: 400 }
        ),
      };
    }
  }

  const raw = {
    q: (url.searchParams.get("q") ?? "").trim(),
    limit: url.searchParams.get("limit") ?? "12",
  };

  const schema = z.object({
    q: z.string().max(200),
    limit: z.coerce.number().int().min(1).max(50),
  });

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Invalid query parameters." }, { status: 400 }),
    };
  }

  return { ok: true, q: parsed.data.q, limit: parsed.data.limit };
}
