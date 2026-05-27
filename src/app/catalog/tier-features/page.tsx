"use client";

import { useState, useEffect } from "react";

interface TierFeature {
  id: string;
  tierId: string;
  featureId: string;
  availability: "INCLUDED" | "ADDON" | "NOT_AVAILABLE";
  pricingModel?: "FIXED" | "PER_SEAT" | "PERCENTAGE";
  price?: number;
  feature: { id: string; name: string };
  tier?: { id: string; name: string; basePrice: number };
}

interface Tier {
  id: string;
  name: string;
  basePrice: number;
  productId: string;
  product: { id: string; name: string };
}

interface Feature {
  id: string;
  name: string;
  productId: string;
}

export default function TierFeaturesPage() {
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [tierFeatures, setTierFeatures] = useState<TierFeature[]>([]);
  const [selectedTier, setSelectedTier] = useState("");
  const [featureForm, setFeatureForm] = useState({
    featureId: "",
    availability: "INCLUDED" as "INCLUDED" | "ADDON" | "NOT_AVAILABLE",
    pricingModel: "FIXED" as "FIXED" | "PER_SEAT" | "PERCENTAGE",
    price: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tiersRes, featuresRes, tfRes] = await Promise.all([
        fetch("/api/tiers"),
        fetch("/api/features"),
        fetch("/api/tier-features"),
      ]);

      if (!tiersRes.ok || !featuresRes.ok || !tfRes.ok) {
        throw new Error("Failed to load one or more resources");
      }

      setTiers(await tiersRes.json());
      setFeatures(await featuresRes.json());
      setTierFeatures(await tfRes.json());
    } catch (error) {
    //    console.error("Failed to load data:", error);
    //   alert("Failed to load data. Please refresh the page.");
    }
  };

  const handleAddFeature = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!selectedTier || !featureForm.featureId) {
      alert("Please select a tier and feature");
      return;
    }

    if (featureForm.availability === "ADDON") {
      if (!featureForm.price || isNaN(Number(featureForm.price)) || Number(featureForm.price) <= 0) {
        alert("Please enter a valid price for the add-on");
        return;
      }
      if (!featureForm.pricingModel) {
        alert("Please select a pricing model for the add-on");
        return;
      }
    }

    setLoading(true);
    try {
      const data = {
        tierId: selectedTier,
        featureId: featureForm.featureId,
        availability: featureForm.availability,
        pricingModel:
          featureForm.availability === "ADDON"
            ? featureForm.pricingModel
            : null,
        price: featureForm.availability === "ADDON" ? Number(featureForm.price) : null,
      };

      const res = await fetch("/api/tier-features", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to add feature");
      }

      // Success - reset form and reload
      setFeatureForm({
        featureId: "",
        availability: "INCLUDED",
        pricingModel: "FIXED",
        price: "",
      });
      await loadData();
      alert("Feature added successfully!");
    } catch (error: any) {
      console.error("Error:", error);
      alert(`Error: ${error.message || "Failed to add feature"}`);
    } finally {
      setLoading(false);
    }
  };

  const currentTier = tiers.find((t) => t.id === selectedTier);
  const tierFeaturesList = tierFeatures.filter((tf) => tf.tierId === selectedTier);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Tier Features Configuration
        </h1>
        <p className="text-gray-600 mb-8">
          Define which features are available in each tier and their pricing
        </p>

        {/* Tier Selection */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Select Tier to Configure
          </h2>
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Choose a tier...</option>
            {tiers.map((tier) => (
              <option key={tier.id} value={tier.id}>
                {tier.product?.name} - {tier.name} (${tier.basePrice}/month)
              </option>
            ))}
          </select>
        </div>

        {selectedTier && (
          <>
            {/* Add Feature Form */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Add Feature to {currentTier?.name}
              </h2>
              <form onSubmit={handleAddFeature} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Feature *
                  </label>
                  <select
                    value={featureForm.featureId}
                    onChange={(e) =>
                      setFeatureForm({ ...featureForm, featureId: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select a feature</option>
                    {features
                      .filter((f) => f.productId === currentTier?.productId)
                      .map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability *
                  </label>
                  <div className="space-y-2">
                    {["INCLUDED", "ADDON", "NOT_AVAILABLE"].map((opt) => (
                      <label key={opt} className="flex items-center">
                        <input
                          type="radio"
                          value={opt}
                          checked={featureForm.availability === opt}
                          onChange={(e) =>
                            setFeatureForm({
                              ...featureForm,
                              availability: e.target.value as any,
                            })
                          }
                          className="mr-3"
                        />
                        <span className="text-gray-700">
                          {opt === "INCLUDED"
                            ? "Included at no extra cost"
                            : opt === "ADDON"
                            ? "Available as paid add-on"
                            : "Not available"}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {featureForm.availability === "ADDON" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pricing Model *
                      </label>
                      <div className="space-y-2">
                        {[
                          {
                            value: "FIXED",
                            label: "Fixed monthly price",
                            example: "$200/month",
                          },
                          {
                            value: "PER_SEAT",
                            label: "Per-seat price",
                            example: "$50/seat/month",
                          },
                          {
                            value: "PERCENTAGE",
                            label: "Percentage of product price",
                            example: "10% of base",
                          },
                        ].map((opt) => (
                          <label key={opt.value} className="flex items-center">
                            <input
                              type="radio"
                              value={opt.value}
                              checked={featureForm.pricingModel === opt.value}
                              onChange={(e) =>
                                setFeatureForm({
                                  ...featureForm,
                                  pricingModel: e.target.value as any,
                                })
                              }
                              className="mr-3"
                            />
                            <span className="text-gray-700">
                              {opt.label} ({opt.example})
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price/Value *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={featureForm.price}
                        onChange={(e) =>
                          setFeatureForm({ ...featureForm, price: e.target.value })
                        }
                        placeholder={
                          featureForm.pricingModel === "PERCENTAGE"
                            ? "10"
                            : "0.00"
                        }
                        required={featureForm.availability === "ADDON"}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        {featureForm.pricingModel === "FIXED"
                          ? "Enter the fixed monthly price (must be greater than 0)"
                          : featureForm.pricingModel === "PER_SEAT"
                          ? "Enter the price per seat per month (must be greater than 0)"
                          : "Enter the percentage of base price (e.g., 10 for 10%)"}
                      </p>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={
                    loading ||
                    !featureForm.featureId ||
                    (featureForm.availability === "ADDON" &&
                      (!featureForm.price || isNaN(Number(featureForm.price))))
                  }
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg transition"
                >
                  {loading ? "Adding..." : "Add Feature"}
                </button>
              </form>
            </div>

            {/* Features List */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="px-8 py-6 bg-gray-50 border-b border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Features in {currentTier?.name} ({tierFeaturesList.length})
                </h2>
              </div>
              {tierFeaturesList.length === 0 ? (
                <div className="px-8 py-12 text-center text-gray-500">
                  No features configured for this tier yet
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {tierFeaturesList.map((tf) => (
                    <div key={tf.id} className="px-8 py-6 hover:bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {tf.feature?.name}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            tf.availability === "INCLUDED"
                              ? "bg-green-100 text-green-800"
                              : tf.availability === "ADDON"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {tf.availability === "INCLUDED"
                            ? "Included"
                            : tf.availability === "ADDON"
                            ? "Add-on"
                            : "Not Available"}
                        </span>
                      </div>
                      {tf.availability === "ADDON" && (
                        <p className="text-sm text-gray-600">
                          {tf.pricingModel === "FIXED"
                            ? `$${tf.price} per month`
                            : tf.pricingModel === "PER_SEAT"
                            ? `$${tf.price} per seat per month`
                            : `${tf.price}% of base price`}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
