// 

"use client";

import { useEffect, useState } from "react";

interface Tier {
  id: string;
  name: string;
  basePrice: number;
  productId: string;
  product: { id: string; name: string };
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
}

export default function TierForm() {
  const [products, setProducts] = useState<Product[]>([]);
  const [tiers, setTiers] = useState<Tier[]>([]);

  const [name, setName] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [productId, setProductId] = useState("");
  const [loading, setLoading] = useState(false);

  const loadProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to load products");
    }
  };

  const loadTiers = async () => {
    try {
      const res = await fetch("/api/tiers");
      const data = await res.json();
      setTiers(data);
    } catch (error) {
      console.error("Failed to load tiers");
    }
  };

  useEffect(() => {
    loadProducts();
    loadTiers();
  }, []);

  const saveTier = async () => {
    if (!name || !basePrice || !productId) {
      alert("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/tiers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          basePrice,
          productId,
        }),
      });

      if (!res.ok) {
        alert("Error creating tier");
        return;
      }

      setName("");
      setBasePrice("");
      setProductId("");

      await loadTiers();
    } catch (error) {
      alert("Error creating tier");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Form */}

      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Create New Tier
        </h2>

        <div className="grid gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product *
            </label>
            <select
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            >
              <option value="">Select a product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tier Name *
            </label>
            <input
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Starter, Growth, Enterprise"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Base Price (per seat, per month) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">$</span>
              <input
                className="w-full border border-gray-300 p-3 pl-7 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
                type="number"
                step="0.01"
                min="0"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={saveTier}
            disabled={loading || !name || !basePrice || !productId}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            {loading ? "Creating Tier..." : "Create Tier"}
          </button>
        </div>
      </div>

      {/* Tiers List */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-8 py-6 bg-gray-50 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800">
            All Tiers ({tiers.length})
          </h2>
        </div>
        {tiers.length === 0 ? (
          <div className="px-8 py-12 text-center text-gray-500">
            No tiers yet. Create one to get started!
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className="px-8 py-6 hover:bg-gray-50 transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {tier.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Product: {tier.product?.name || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Price: ${tier.basePrice.toFixed(2)}/seat/month
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">
                      Created {new Date(tier.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}