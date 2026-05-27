import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const tiers = await prisma.tier.findMany({
    include: {
      product: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(tiers);
}

export async function POST(req: Request) {
  const body = await req.json();

  const product = await prisma.product.findUnique({
    where: {
      id: body.productId,
    },
  });

  if (!product) {
    return NextResponse.json(
      { message: "Product not found" },
      { status: 404 }
    );
  }

  const tier = await prisma.tier.create({
    data: {
      name: body.name,
      basePrice: Number(body.basePrice),
      productId: body.productId,
    },
  });

  return NextResponse.json(tier);
}