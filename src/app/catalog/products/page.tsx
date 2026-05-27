"use client";

import { useEffect, useState } from "react";

export default function ProductPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  return (
    <div>
      <h1>Products</h1>

      {products.map((product: any) => (
        <div key={product.id}>
          {product.name}
        </div>
      ))}
    </div>
  );
}