"use client";

import { useState, useEffect } from "react";

interface Product {
  id: string;
  name: string;
}

interface Feature {
  id: string;
  name: string;
  productId: string;
  product: Product;
  createdAt: string;
}

export default function FeaturesPage() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [productId, setProductId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsRes, featuresRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/features"),
      ]);
      setProducts(await productsRes.json());
      setFeatures(await featuresRes.json());
    } catch (error) {
    //   alert("");
    }
  };

  const handleCreateFeature = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !productId) {
      alert("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/features", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, productId }),
      });

      if (!res.ok) throw new Error("Failed to create feature");

      setName("");
      setProductId("");
      await loadData();
    } catch (error) {
    //   alert("Error creating feature");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Features</h1>
        <p className="text-gray-600 mb-8">
          Create and manage features available for your products
        </p>

        {/* Create Feature Form */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Create New Feature
          </h2>
          <form onSubmit={handleCreateFeature} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Feature Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Single Sign-On, API Access"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product *
                </label>
                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select a product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg transition"
            >
              {loading ? "Creating..." : "Create Feature"}
            </button>
          </form>
        </div>

        {/* Features List */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-8 py-6 bg-gray-50 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800">
              All Features ({features.length})
            </h2>
          </div>
          {features.length === 0 ? (
            <div className="px-8 py-12 text-center text-gray-500">
              No features yet. Create one to get started!
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className="px-8 py-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {feature.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Product: {feature.product?.name || "Unknown"}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      Created {new Date(feature.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
