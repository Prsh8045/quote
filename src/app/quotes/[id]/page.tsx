"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { generateLineItems } from "../../../services/pricing";

interface Quote {
  id: string;
  quoteName: string;
  customerName: string;
  seats: number;
  term: string;
  discountPercent: number;
  subtotal: number;
  total: number;
  product: { id: string; name: string };
  tier: { id: string; name: string; basePrice: number };
  addOns: Array<{
    id: string;
    featureId: string;
    seats?: number;
    calculatedPrice: number;
    feature: { id: string; name: string };
  }>;
  createdAt: string;
}

export default function QuoteViewPage() {
  const params = useParams();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadQuote();
  }, [params.id]);

  const loadQuote = async () => {
    try {
      const res = await fetch(`/api/quotes/${params.id}`);
      if (!res.ok) throw new Error("Quote not found");
      setQuote(await res.json());
    } catch (error) {
    //   setError("Failed to load quote");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600">Loading quote...</p>
        </div>
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <p className="text-red-600 font-semibold">{error || "Quote not found"}</p>
        </div>
      </div>
    );
  }

  const termLabel =
    quote.term === "MONTHLY"
      ? "Monthly"
      : quote.term === "ANNUAL"
      ? "Annual"
      : "2-Year";

  const termDiscount =
    quote.term === "ANNUAL" ? 0.15 : quote.term === "TWO_YEAR" ? 0.25 : 0;

  // Generate line items for display
  const lineItems = generateLineItems(
    quote.product,
    quote.tier,
    quote.seats,
    quote.term,
    quote.addOns.map((addon) => ({
      featureId: addon.featureId,
      pricingModel: "FIXED" as const, // This is simplified - in a real app we'd fetch the pricing model
      price: addon.calculatedPrice,
      seats: addon.seats,
    })),
    quote.discountPercent
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-12 mb-8">
          <div className="mb-6">
            <p className="text-gray-600 text-sm mb-2">Quote ID</p>
            <p className="text-gray-400 font-mono text-xs">{quote.id}</p>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {quote.quoteName}
          </h1>
          <p className="text-xl text-gray-600 mb-8">For {quote.customerName}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="border-l-4 border-indigo-600 pl-4">
              <p className="text-sm text-gray-600">Product</p>
              <p className="text-lg font-semibold text-gray-900">
                {quote.product.name}
              </p>
            </div>
            <div className="border-l-4 border-green-600 pl-4">
              <p className="text-sm text-gray-600">Tier</p>
              <p className="text-lg font-semibold text-gray-900">
                {quote.tier.name}
              </p>
            </div>
            <div className="border-l-4 border-blue-600 pl-4">
              <p className="text-sm text-gray-600">Seats</p>
              <p className="text-lg font-semibold text-gray-900">
                {quote.seats}
              </p>
            </div>
            <div className="border-l-4 border-purple-600 pl-4">
              <p className="text-sm text-gray-600">Term</p>
              <p className="text-lg font-semibold text-gray-900">
                {termLabel}
                {termDiscount > 0 && (
                  <span className="text-green-600 text-sm block">
                    ({Math.round(termDiscount * 100)}% discount)
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-600 mb-1">Created</p>
            <p className="text-gray-900">
              {new Date(quote.createdAt).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        {/* Line Items */}
        <div className="bg-white rounded-lg shadow-lg p-12 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Quote Breakdown
          </h2>

          <div className="space-y-4 mb-8">
            {/* Base Product */}
            <div className="flex justify-between items-start border-b border-gray-200 pb-4">
              <div>
                <h3 className="font-semibold text-gray-900">
                  {quote.product.name} - {quote.tier.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {quote.seats} seat{quote.seats > 1 ? "s" : ""} ×{" "}
                  ${quote.tier.basePrice.toFixed(2)}/seat
                  {termDiscount > 0 && (
                    <>
                      <br />
                      After {Math.round(termDiscount * 100)}% {termLabel} discount
                    </>
                  )}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  ${(quote.subtotal - quote.addOns.reduce((sum, addon) => sum + addon.calculatedPrice, 0)).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Add-ons */}
            {quote.addOns.length > 0 && (
              <>
                <div className="my-6 border-t-2 border-gray-300" />
                {quote.addOns.map((addon) => (
                  <div
                    key={addon.id}
                    className="flex justify-between items-start pb-4"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Add-on: {addon.feature.name}
                      </h3>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ${addon.calculatedPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Totals */}
          <div className="border-t-2 border-gray-300 pt-6 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-700">Subtotal</span>
              <span className="text-gray-900 font-semibold">
                ${quote.subtotal.toFixed(2)}
              </span>
            </div>

            {quote.discountPercent > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount ({quote.discountPercent}%)</span>
                <span className="font-semibold">
                  -${(quote.subtotal - quote.total).toFixed(2)}
                </span>
              </div>
            )}

            <div className="flex justify-between text-xl font-bold bg-gradient-to-r from-indigo-50 to-blue-50 px-4 py-4 rounded-lg border-2 border-indigo-600">
              <span className="text-gray-900">Total</span>
              <span className="text-indigo-600">${quote.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-600 text-sm">
          <p>This is a read-only quote view. Share this URL with your customer.</p>
          <p className="mt-2">Created on {new Date(quote.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
