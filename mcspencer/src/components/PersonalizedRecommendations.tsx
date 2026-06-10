import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { products, Product } from "../lib/data";
import { ProductCard } from "./ProductCard";

const PICKS: string[] = ["3", "7", "14", "16", "10", "17"];
const recommended = PICKS.map((id) => products.find((p) => p.id === id)!).filter(Boolean);

export function PersonalizedRecommendations({ onAddToCart }: { onAddToCart: (p: Product) => void }) {
  return (
    <section className="py-20 px-6 bg-background" data-testid="section-recommendations">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[hsl(86,72%,38%)] mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Curated for You
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[hsl(222,62%,28%)]">
              Personalized Recommendations
            </h2>
            <p className="text-muted-foreground mt-2 text-base max-w-xl">
              Handpicked across our six departments — tools, tech, fashion and more, all in one place.
            </p>
          </div>
          <a
            href="/shop"
            onClick={(e) => { e.preventDefault(); window.location.href = "/shop"; }}
            className="self-start sm:self-auto shrink-0 text-sm font-semibold text-[hsl(222,62%,28%)] hover:text-[hsl(86,72%,38%)] underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            View all →
          </a>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {recommended.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProductCard product={product} onAdd={onAddToCart} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
