import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim().toLowerCase();

  if (!q) return NextResponse.json([], { status: 200 });

  // TODO: Replace this with CREA DDF Web API calls when credentials are ready.
  const mock = [
    { id: "m1", address: "100 King St W", city: "Toronto", price: 999000, beds: 2, baths: 2 },
    { id: "m2", address: "2200 Lake Shore Blvd W", city: "Toronto", price: 749000, beds: 1, baths: 1 },
    { id: "m3", address: "350 Bloor St E", city: "Toronto", price: 1299000, beds: 2, baths: 2 },
  ].filter((x) => `${x.address} ${x.city}`.toLowerCase().includes(q));

  return NextResponse.json(mock, { status: 200 });
}