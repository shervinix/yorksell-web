import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/db/prisma";

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const name = body?.name != null ? String(body.name).trim() || null : undefined;
    const phone = body?.phone != null ? String(body.phone).trim() || null : undefined;
    const company = body?.company != null ? String(body.company).trim() || null : undefined;
    const address = body?.address != null ? String(body.address).trim() || null : undefined;
    const image = body?.image != null ? String(body.image).trim() || null : undefined;

    const data: {
      name?: string | null;
      phone?: string | null;
      company?: string | null;
      address?: string | null;
      image?: string | null;
    } = {};
    if (name !== undefined) data.name = name;
    if (phone !== undefined) data.phone = phone;
    if (company !== undefined) data.company = company;
    if (address !== undefined) data.address = address;
    if (image !== undefined) data.image = image;

    const user = await prisma.user.update({
      where: { id: session.user.id as string },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        company: true,
        address: true,
        image: true,
      },
    });

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Failed to update profile." }, { status: 400 });
  }
}
