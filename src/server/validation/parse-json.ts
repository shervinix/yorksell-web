import { NextResponse } from "next/server";
import type { z } from "zod";

/** Parse JSON and validate with a strict Zod schema; generic errors only (no schema leak). */
export async function parseJsonBody<T>(
  req: Request,
  schema: z.ZodType<T>
): Promise<{ ok: true; data: T } | { ok: false; response: NextResponse }> {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return {
      ok: false,
      response: NextResponse.json({ error: "Invalid JSON body." }, { status: 400 }),
    };
  }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Invalid or unexpected fields in request body." },
        { status: 400 }
      ),
    };
  }

  return { ok: true, data: parsed.data };
}
