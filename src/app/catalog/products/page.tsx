"use client";

import { useState, useEffect } from "react";

interface Product {
  id: string;
  name: string;
  createdAt: string;
}

export default function ProductManagementPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const loadProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to load products");
      }
      const data = await res.json();
      setProducts(data);
    } catch (error: any) {
      console.error("Load products error:", error);
      alert(`Failed to load products: ${error.message}`);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Product name is required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to create product");
      }

      setName("");
      await loadProducts();
    } catch (error: any) {
      console.error("Create product error:", error);
      alert(`Error creating product: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Products</h1>
        <p className="text-gray-600 mb-8">
          Create and manage products that your customers can purchase
        </p>

        {/* Create Product Form */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Create New Product
          </h2>
          <form onSubmit={handleCreateProduct} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., SaaS Analytics Platform"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg transition"
            >
              {loading ? "Creating..." : "Create Product"}
            </button>
          </form>
        </div>

        {/* Products List */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-8 py-6 bg-gray-50 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800">
              All Products ({products.length})
            </h2>
          </div>
          {products.length === 0 ? (
            <div className="px-8 py-12 text-center text-gray-500">
              No products yet. Create one to get started!
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="px-8 py-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        ID: {product.id.slice(0, 8)}...
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      Created {new Date(product.createdAt).toLocaleDateString()}
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