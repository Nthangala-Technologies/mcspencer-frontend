import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Flame } from "lucide-react";
import { useLocation } from "wouter";
import { products, Product } from "../lib/data";
import { formatZAR } from "../lib/currency";
import { ProductCard } from "./ProductCard";

const TRENDING_IDS = ["5", "2", "9", "12", "15", "20"];
const trending = TRENDING_IDS.map((id) => products.find((p) => p.id === id)!).filter(Boolean);

const RANK_COLOURS = [
  "from-yellow-400 to-orange-500",
  "from-slate-400 to-slate-600",
  "from-amber-600 to-amber-800",
];

export function TrendingProducts({ onAddToCart }: { onAddToCart: (p: Product) => void }) {
  const [, setLocation] = useLocation();

  return (
    <section className="py-20 px-6 bg-muted/40" data-testid="section-trending">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[hsl(86,72%,38%)] mb-3">
              <Flame className="w-3.5 h-3.5 fill-[hsl(86,72%,38%)]" /> Hot Right Now
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[hsl(222,62%,28%)]">
              Trending Products
            </h2>
            <p className="text-muted-foreground mt-2 text-base">
              What South Africans are buying this week.
            </p>
          </div>
          <button
            onClick={() => setLocation("/shop?sort=price-desc")}
            className="self-start sm:self-auto shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-[hsl(222,62%,28%)] hover:text-[hsl(86,72%,38%)] underline underline-offset-4 transition-colors"
          >
            <TrendingUp className="w-4 h-4" /> See all trends
          </button>
        </div>

        {/* Top 3 podium */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
          {trending.slice(0, 3).map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setLocation(`/product/${product.id}`)}
              className="group bg-white rounded-2xl overflow-hidden flex flex-col cursor-pointer border-2 border-border hover:border-[hsl(86,72%,45%)] hover:shadow-lg transition-all"
            >
              {/* Rank badge */}
              <div className="relative h-[200px] overflow-hidden bg-muted">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                />
                <div className={`absolute top-3 left-3 w-9 h-9 rounded-full bg-gradient-to-br ${RANK_COLOURS[i]} flex items-center justify-center shadow-lg`}>
                  <span className="text-white font-black text-sm">#{i + 1}</span>
                </div>
                <span className="absolute top-3 right-3 text-[10px] font-bold bg-[hsl(86,72%,45%)] text-white px-2 py-0.5 rounded-full">
                  {product.category}
                </span>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-sm text-[hsl(222,62%,28%)] line-clamp-2 mb-2 group-hover:text-[hsl(86,72%,38%)] transition-colors">
                  {product.name}
                </h3>
                <p className="text-muted-foreground text-xs line-clamp-2 mb-3 flex-1 leading-relaxed">{product.description}</p>
                <p className="text-lg font-black text-[hsl(222,62%,28%)]">{formatZAR(product.price)}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Remaining 3 as smaller cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {trending.slice(3).map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProductCard product={product} onAdd={onAddToCart} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
