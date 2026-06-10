import React from "react";
import { products, Product } from "../lib/data";
import { ProductCard } from "./ProductCard";

interface FeaturedProductsProps {
  onAddToCart: (product: Product) => void;
}

export function FeaturedProducts({ onAddToCart }: FeaturedProductsProps) {
  const featured = products.slice(0, 2); // Show first 2 products as featured

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto bg-background" data-testid="section-featured">
      <div className="space-y-12">
        {featured.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAdd={onAddToCart}
            featured={true}
          />
        ))}
      </div>
    </section>
  );
}
