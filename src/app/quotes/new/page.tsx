"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SelectedAddon } from "../../../services/pricing";

interface Product {
  id: string;
  name: string;
}

interface Tier {
  id: string;
  name: string;
  basePrice: number;
  productId: string;
}

interface Feature {
  id: string;
  name: string;
}

interface TierFeature {
  id: string;
  tierId: string;
  featureId: string;
  availability: "INCLUDED" | "ADDON" | "NOT_AVAILABLE";
  pricingModel?: "FIXED" | "PER_SEAT" | "PERCENTAGE";
  price?: number;
  feature: Feature;
}

type Step = "basic" | "product" | "addons" | "review";

export default function NewQuotePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("basic");
  const [loading, setLoading] = useState(false);

  // Data
  const [products, setProducts] = useState<Product[]>([]);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [tierFeatures, setTierFeatures] = useState<TierFeature[]>([]);

  // Form state
  const [quoteName, setQuoteName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [productId, setProductId] = useState("");
  const [tierId, setTierId] = useState("");
  const [seats, setSeats] = useState("1");
  const [term, setTerm] = useState("MONTHLY");
  const [discountPercent, setDiscountPercent] = useState("0");
  const [selectedAddons, setSelectedAddons] = useState<SelectedAddon[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsRes, tiersRes, tfRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/tiers"),
        fetch("/api/tier-features"),
      ]);
      setProducts(await productsRes.json());
      setTiers(await tiersRes.json());
      setTierFeatures(await tfRes.json());
    } catch (error) {
    //   alert("Failed to load data");
    }
  };

  const currentProduct = products.find((p) => p.id === productId);
  const currentTier = tiers.find((t) => t.id === tierId);
  const availableAddons = tierFeatures.filter(
    (tf) => tf.tierId === tierId && tf.availability === "ADDON"
  );

  const toggleAddon = (addon: TierFeature) => {
    const existing = selectedAddons.find((a) => a.featureId === addon.featureId);
    if (existing) {
      setSelectedAddons(
        selectedAddons.filter((a) => a.featureId !== addon.featureId)
      );
    } else {
      setSelectedAddons([
        ...selectedAddons,
        {
          featureId: addon.featureId,
          pricingModel: addon.pricingModel as any,
          price: addon.price!,
          seats: addon.pricingModel === "PER_SEAT" ? parseInt(seats) : undefined,
        },
      ]);
    }
  };

  const handleSubmit = async () => {
    if (!quoteName || !customerName || !productId || !tierId) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteName,
          customerName,
          productId,
          tierId,
          seats: parseInt(seats),
          term,
          discountPercent: parseFloat(discountPercent),
          selectedAddons,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create quote");
      }

      const quote = await res.json();
      router.push(`/quotes/${quote.id}`);
    } catch (error) {
      alert(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const steps: { key: Step; label: string }[] = [
    { key: "basic", label: "Basic Info" },
    { key: "product", label: "Product & Tier" },
    { key: "addons", label: "Add-ons" },
    { key: "review", label: "Review" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Quote</h1>
        <p className="text-gray-600 mb-8">
          Build a new quote for your customer
        </p>

        {/* Progress Indicator */}
        <div className="mb-8 bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center">
            {steps.map((s, idx) => (
              <div key={s.key} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold cursor-pointer transition ${
                    step === s.key
                      ? "bg-indigo-600 text-white"
                      : idx < steps.findIndex((st) => st.key === step)
                      ? "bg-green-500 text-white"
                      : "bg-gray-300 text-gray-700"
                  }`}
                  onClick={() =>
                    idx <= steps.findIndex((st) => st.key === step) &&
                    setStep(s.key)
                  }
                >
                  {idx < steps.findIndex((st) => st.key === step) ? "✓" : idx + 1}
                </div>
                <span
                  className={`ml-2 text-sm font-semibold ${
                    step === s.key ? "text-indigo-600" : "text-gray-600"
                  }`}
                >
                  {s.label}
                </span>
                {idx < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 ${
                      idx < steps.findIndex((st) => st.key === step)
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          {step === "basic" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Basic Information
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quote Name *
                </label>
                <input
                  type="text"
                  value={quoteName}
                  onChange={(e) => setQuoteName(e.target.value)}
                  placeholder="e.g., Acme Corp - Q2 2026 Proposal"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g., Acme Corp"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {step === "product" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Product & Pricing
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product *
                </label>
                <select
                  value={productId}
                  onChange={(e) => {
                    setProductId(e.target.value);
                    setTierId("");
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select a product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {productId && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tier *
                    </label>
                    <select
                      value={tierId}
                      onChange={(e) => setTierId(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Select a tier</option>
                      {tiers
                        .filter((t) => t.productId === productId)
                        .map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name} - ${t.basePrice}/month per seat
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Seats *
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={seats}
                        onChange={(e) => setSeats(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contract Term *
                      </label>
                      <select
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="MONTHLY">Monthly</option>
                        <option value="ANNUAL">Annual (15% discount)</option>
                        <option value="TWO_YEAR">2-Year (25% discount)</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {step === "addons" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Add-ons
              </h2>
              {availableAddons.length === 0 ? (
                <p className="text-gray-600">
                  No add-ons available for this tier
                </p>
              ) : (
                <div className="space-y-3">
                  {availableAddons.map((addon) => {
                    const isSelected = selectedAddons.some(
                      (a) => a.featureId === addon.featureId
                    );
                    return (
                      <div
                        key={addon.id}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                          isSelected
                            ? "border-indigo-600 bg-indigo-50"
                            : "border-gray-300 hover:border-indigo-400"
                        }`}
                        onClick={() => toggleAddon(addon)}
                      >
                        <div className="flex items-start">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="mt-1 w-5 h-5 text-indigo-600 rounded"
                          />
                          <div className="ml-4 flex-1">
                            <h3 className="font-semibold text-gray-900">
                              {addon.feature?.name}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {addon.pricingModel === "FIXED"
                                ? `$${addon.price}/month`
                                : addon.pricingModel === "PER_SEAT"
                                ? `$${addon.price}/seat/month`
                                : `${addon.price}% of base price`}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {selectedAddons.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Selected Add-ons
                  </h3>
                  <div className="space-y-2">
                    {selectedAddons.map((addon) => {
                      const feature = availableAddons.find(
                        (a) => a.featureId === addon.featureId
                      )?.feature;
                      return (
                        <div
                          key={addon.featureId}
                          className="flex justify-between text-sm"
                        >
                          <span>{feature?.name}</span>
                          <span className="text-gray-600">
                            {addon.pricingModel === "FIXED"
                              ? `$${addon.price}`
                              : addon.pricingModel === "PER_SEAT"
                              ? `${addon.seats} × $${addon.price}`
                              : `${addon.price}%`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === "review" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Review & Save
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Quote Name</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {quoteName}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Customer</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {customerName}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Product</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {currentProduct?.name} - {currentTier?.name}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Seats & Term
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {seats} seats, {term.toLowerCase()}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quote Discount (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition"
              >
                {loading ? "Creating Quote..." : "Create & Save Quote"}
              </button>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={() => {
              const stepIndex = steps.findIndex((s) => s.key === step);
              if (stepIndex > 0) setStep(steps[stepIndex - 1].key);
            }}
            disabled={step === "basic"}
            className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            Previous
          </button>
          <button
            onClick={() => {
              const stepIndex = steps.findIndex((s) => s.key === step);
              if (stepIndex < steps.length - 1) setStep(steps[stepIndex + 1].key);
            }}
            disabled={step === "review"}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
