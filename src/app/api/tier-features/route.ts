import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tierId = searchParams.get("tierId");

    if (tierId) {
      const tierFeatures = await prisma.tierFeature.findMany({
        where: { tierId },
        include: { feature: true },
      });
      return NextResponse.json(tierFeatures);
    }

    const tierFeatures = await prisma.tierFeature.findMany({
      include: { feature: true, tier: true },
    });
    return NextResponse.json(tierFeatures);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch tier features" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tierId, featureId, availability, pricingModel, price } = body;

    if (!tierId || !featureId || !availability) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const tierFeature = await prisma.tierFeature.create({
      data: {
        tierId,
        featureId,
        availability,
        pricingModel: availability === "ADDON" ? pricingModel : null,
        price: availability === "ADDON" ? price : null,
      },
      include: { feature: true },
    });

    return NextResponse.json(tierFeature);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create tier feature" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, tierId, featureId, availability, pricingModel, price } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Tier feature ID required" },
        { status: 400 }
      );
    }

    const tierFeature = await prisma.tierFeature.update({
      where: { id },
      data: {
        availability,
        pricingModel: availability === "ADDON" ? pricingModel : null,
        price: availability === "ADDON" ? price : null,
      },
      include: { feature: true },
    });

    return NextResponse.json(tierFeature);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update tier feature" },
      { status: 500 }
    );
  }
}
