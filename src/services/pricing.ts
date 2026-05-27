// Pricing calculation service

export interface SelectedAddon {
  featureId: string;
  pricingModel: "FIXED" | "PER_SEAT" | "PERCENTAGE";
  price: number;
  seats?: number;
}

const TERM_DISCOUNTS: Record<string, number> = {
  MONTHLY: 0,
  ANNUAL: 0.15,
  TWO_YEAR: 0.25,
};

/**
 * Calculate the price of a single add-on based on pricing model
 */
export function calculateAddonPrice(
  addon: SelectedAddon,
  basePrice: number,
  seats: number
): number {
  switch (addon.pricingModel) {
    case "FIXED":
      return addon.price;
    case "PER_SEAT":
      return addon.price * (addon.seats || seats);
    case "PERCENTAGE":
      return (addon.price / 100) * basePrice * seats;
    default:
      return 0;
  }
}

/**
 * Calculate the full quote including base product and all add-ons
 */
export function calculateQuoteTotal(
  basePrice: number,
  seats: number,
  term: string,
  selectedAddons: SelectedAddon[],
  discountPercent: number
): { subtotal: number; total: number } {
  // Calculate base product cost with term discount
  const termDiscount = TERM_DISCOUNTS[term] || 0;
  const discountedBasePrice = basePrice * (1 - termDiscount);
  const baseCost = discountedBasePrice * seats;

  // Calculate add-on costs
  const addonsCost = selectedAddons.reduce((sum, addon) => {
    return sum + calculateAddonPrice(addon, basePrice, seats);
  }, 0);

  // Subtotal before quote discount
  const subtotal = baseCost + addonsCost;

  // Apply quote-level discount
  const quoteDiscount = (discountPercent / 100) * subtotal;
  const total = subtotal - quoteDiscount;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}

/**
 * Generate detailed line items for a quote (for display)
 */
export interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  calculation: string;
}

export function generateLineItems(
  product: any,
  tier: any,
  seats: number,
  term: string,
  selectedAddons: SelectedAddon[],
  discountPercent: number
): {
  items: LineItem[];
  subtotal: number;
  quoteDiscount: number;
  total: number;
} {
  const items: LineItem[] = [];

  // Base product line item
  const termDiscount = TERM_DISCOUNTS[term] || 0;
  const discountedBasePrice = tier.basePrice * (1 - termDiscount);
  const baseTotal = discountedBasePrice * seats;

  const termLabel = term === "MONTHLY" ? "Monthly" : term === "ANNUAL" ? "Annual (15% discount)" : "2-Year (25% discount)";
  
  items.push({
    description: `${product.name} - ${tier.name} (${termLabel}) - ${seats} seat${seats > 1 ? "s" : ""}`,
    quantity: seats,
    unitPrice: discountedBasePrice,
    total: baseTotal,
    calculation: `${seats} seats × $${discountedBasePrice.toFixed(2)}/seat = $${baseTotal.toFixed(2)}`,
  });

  // Add-on line items
  selectedAddons.forEach((addon) => {
    const addonPrice = calculateAddonPrice(addon, tier.basePrice, seats);
    let calculation = "";

    if (addon.pricingModel === "FIXED") {
      calculation = `Fixed price: $${addon.price.toFixed(2)}`;
    } else if (addon.pricingModel === "PER_SEAT") {
      const seatCount = addon.seats || seats;
      calculation = `${seatCount} seats × $${addon.price.toFixed(2)}/seat = $${addonPrice.toFixed(2)}`;
    } else if (addon.pricingModel === "PERCENTAGE") {
      calculation = `${addon.price}% of base (${seats} seats × $${tier.basePrice.toFixed(2)}) = $${addonPrice.toFixed(2)}`;
    }

    items.push({
      description: `Add-on: ${addon.featureId}`, // This will be replaced with actual feature name
      quantity: 1,
      unitPrice: addonPrice,
      total: addonPrice,
      calculation,
    });
  });

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const quoteDiscount = (discountPercent / 100) * subtotal;
  const total = subtotal - quoteDiscount;

  return {
    items,
    subtotal: Math.round(subtotal * 100) / 100,
    quoteDiscount: Math.round(quoteDiscount * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}
