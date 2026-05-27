import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const feature = await prisma.feature.create({
    data: {
      name: body.name,
      productId: body.productId,
    },
  });

  return NextResponse.json(feature);
}

export async function GET() {
  const features = await prisma.feature.findMany();

  return NextResponse.json(features);
}