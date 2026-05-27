import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const tier = await prisma.tier.create({
    data: {
      name: body.name,
      basePrice: Number(body.basePrice || 0),
      productId: body.productId,
    },
  });

  return NextResponse.json(tier);
}

export async function GET() {
  const tiers = await prisma.tier.findMany();

  return NextResponse.json(tiers);
}