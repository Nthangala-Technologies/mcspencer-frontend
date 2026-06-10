import React from "react";
import { products, Product, Category } from "../lib/data";
import { ProductCard } from "./ProductCard";
import { motion } from "framer-motion";

interface ProductGridProps {
  onAddToCart: (product: Product) => void;
  selectedCategory: Category | null;
}

export function ProductGrid({ onAddToCart, selectedCategory }: ProductGridProps) {
  const filtered = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  return (
    <section id="shop" className="py-24 px-6 bg-muted scroll-m-16" data-testid="section-shop">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight mb-4" data-testid="text-shop-title">
            {selectedCategory ? selectedCategory : "The Collection"}
          </h2>
          <p className="text-muted-foreground text-lg" data-testid="text-shop-subtitle">
            {selectedCategory
              ? `${filtered.length} product${filtered.length !== 1 ? "s" : ""} in ${selectedCategory}`
              : "Uncompromising tools for uncompromising work."}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <ProductCard product={product} onAdd={onAddToCart} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
