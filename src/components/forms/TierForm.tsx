"use client";

import { useEffect, useState } from "react";

export default function TierForm() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [productId, setProductId] = useState("");

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  const saveTier = async () => {
    await fetch("/api/tiers", {
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

    alert("Tier Created");
  };

  return (
    <div>
      <input
        placeholder="Tier Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Base Price"
        value={basePrice}
        onChange={(e) => setBasePrice(e.target.value)}
      />

      <select
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
      >
        <option>Select Product</option>

        {products.map((product: any) => (
          <option key={product.id} value={product.id}>
            {product.name}
          </option>
        ))}
      </select>

      <button onClick={saveTier}>
        Save Tier
      </button>
    </div>
  );
}