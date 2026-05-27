import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";
import { calculateQuoteTotal } from "../../../services/pricing";

export async function GET(req: Request) {
  try {
    const quotes = await prisma.quote.findMany({
      include: {
        product: true,
        tier: true,
        addOns: { include: { feature: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(quotes);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch quotes" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      quoteName,
      customerName,
      productId,
      tierId,
      seats,
      term,
      discountPercent,
      selectedAddons,
    } = body;

    if (!quoteName || !customerName || !productId || !tierId || !seats || !term) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Fetch product, tier, and tier features
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    const tier = await prisma.tier.findUnique({
      where: { id: tierId },
    });

    if (!product || !tier) {
      return NextResponse.json(
        { error: "Product or tier not found" },
        { status: 404 }
      );
    }

    // Calculate totals
    const { subtotal, total } = calculateQuoteTotal(
      tier.basePrice,
      seats,
      term,
      selectedAddons || [],
      discountPercent || 0
    );

    // Create quote
    const quote = await prisma.quote.create({
      data: {
        quoteName,
        customerName,
        productId,
        tierId,
        seats,
        term,
        discountPercent: discountPercent || 0,
        subtotal,
        total,
        addOns: {
          create: (selectedAddons || []).map((addon: any) => ({
            featureId: addon.featureId,
            seats: addon.seats || null,
            calculatedPrice: addon.calculatedPrice,
          })),
        },
      },
      include: {
        product: true,
        tier: true,
        addOns: { include: { feature: true } },
      },
    });

    return NextResponse.json(quote);
  } catch (error) {
    console.error("Error creating quote:", error);
    return NextResponse.json(
      { error: "Failed to create quote" },
      { status: 500 }
    );
  }
}
