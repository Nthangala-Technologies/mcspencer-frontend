import React from "react";
import { motion } from "framer-motion";
import { GitCompare, X, ShoppingCart, Check, ArrowLeft, Plus } from "lucide-react";
import { useLocation } from "wouter";
import { useCompare } from "../contexts/CompareContext";
import { formatZAR } from "../lib/currency";
import { Product } from "../lib/data";

const ROWS: { key: keyof Product | "specs"; label: string }[] = [
  { key: "image",       label: "Product" },
  { key: "price",       label: "Price" },
  { key: "category",    label: "Category" },
  { key: "description", label: "Description" },
  { key: "specs",       label: "Specifications" },
];

function AddedState({ onAdd, product }: { onAdd: (p: Product) => void; product: Product }) {
  const [added, setAdded] = React.useState(false);
  const handle = () => { onAdd(product); setAdded(true); setTimeout(() => setAdded(false), 1600); };
  return (
    <button
      onClick={handle}
      className={`w-full py-2.5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
        added ? "bg-green-600 text-white" : "btn-primary"
      }`}
    >
      {added ? <><Check className="w-3.5 h-3.5" /> Added</> : <><ShoppingCart className="w-3.5 h-3.5" /> Add to Cart</>}
    </button>
  );
}

export function Compare({ onAddToCart }: { onAddToCart: (p: Product) => void }) {
  const { compareList, toggleCompare, clearCompare, count, atMax } = useCompare();
  const [, setLocation] = useLocation();

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen bg-muted/30 pt-16 pb-24 md:pb-10">
      {/* Header */}
      <div className="bg-[hsl(222,62%,28%)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <button
            onClick={() => setLocation("/shop")}
            className="flex items-center gap-2 text-white/60 hover:text-white text-sm font-semibold mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Shop
          </button>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[hsl(86,72%,45%)]/20 border border-[hsl(86,72%,45%)]/40 flex items-center justify-center">
                <GitCompare className="w-5 h-5 text-[hsl(86,72%,65%)]" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Compare</h1>
                <p className="text-white/60 text-sm mt-0.5">{count} product{count !== 1 ? "s" : ""} selected (max 4)</p>
              </div>
            </div>
            {count > 0 && (
              <button
                onClick={clearCompare}
                className="text-xs font-semibold text-white/60 hover:text-white underline underline-offset-4 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {count === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border-2 border-border rounded-2xl py-24 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-[hsl(86,72%,45%)]/10 border-2 border-[hsl(86,72%,45%)]/30 flex items-center justify-center mx-auto mb-5">
              <GitCompare className="w-9 h-9 text-[hsl(86,72%,45%)]" />
            </div>
            <p className="font-black text-[hsl(222,62%,28%)] text-xl mb-2">Nothing to compare yet</p>
            <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto">
              Click the compare icon on any product card to add it here. Compare up to 4 products side by side.
            </p>
            <button
              onClick={() => setLocation("/shop")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full btn-primary font-bold text-sm"
            >
              <Plus className="w-4 h-4" /> Add Products
            </button>
          </motion.div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              {/* Column headers */}
              <div
                className="grid gap-3 mb-3"
                style={{ gridTemplateColumns: `180px repeat(${count}, 1fr)` }}
              >
                <div />
                {compareList.map((product) => (
                  <div key={product.id} className="relative">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white border-2 border-border rounded-2xl overflow-hidden"
                    >
                      <div className="relative h-40 bg-muted">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => toggleCompare(product)}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-red-50 transition-colors"
                        >
                          <X className="w-3.5 h-3.5 text-muted-foreground hover:text-red-500" />
                        </button>
                      </div>
                      <div className="p-3">
                        <p className="font-bold text-xs text-[hsl(222,62%,28%)] line-clamp-2 mb-3">{product.name}</p>
                        <AddedState onAdd={onAddToCart} product={product} />
                      </div>
                    </motion.div>
                  </div>
                ))}
                {/* Empty add slots */}
                {!atMax && Array.from({ length: 4 - count }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setLocation("/shop")}
                    className="border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-2 min-h-[230px] hover:border-[hsl(86,72%,45%)] hover:bg-[hsl(86,72%,45%)]/5 transition-colors group"
                  >
                    <Plus className="w-6 h-6 text-muted-foreground group-hover:text-[hsl(86,72%,45%)] transition-colors" />
                    <span className="text-xs font-semibold text-muted-foreground group-hover:text-[hsl(86,72%,45%)] transition-colors">Add product</span>
                  </button>
                ))}
              </div>

              {/* Comparison rows */}
              {[
                { label: "Price", render: (p: Product) => <span className="font-black text-[hsl(222,62%,28%)] text-lg">{formatZAR(p.price)}</span> },
                { label: "Category", render: (p: Product) => <span className="inline-block text-xs font-bold bg-[hsl(86,72%,45%)] text-white px-2.5 py-1 rounded-full">{p.category}</span> },
                { label: "Description", render: (p: Product) => <p className="text-xs text-muted-foreground leading-relaxed">{p.description}</p> },
                { label: "Specifications", render: (p: Product) => (
                  p.details?.length
                    ? <ul className="space-y-1">{p.details.map((d, i) => <li key={i} className="text-xs text-muted-foreground flex gap-1.5"><span className="text-[hsl(86,72%,45%)] font-bold mt-0.5">✓</span>{d}</li>)}</ul>
                    : <span className="text-xs text-muted-foreground">—</span>
                )},
              ].map(({ label, render }) => (
                <div
                  key={label}
                  className="grid gap-3 mb-3"
                  style={{ gridTemplateColumns: `180px repeat(${count}, 1fr)` }}
                >
                  <div className="flex items-start pt-4">
                    <span className="text-xs font-black uppercase tracking-widest text-[hsl(222,62%,28%)]">{label}</span>
                  </div>
                  {compareList.map((product) => (
                    <div key={product.id} className="bg-white border-2 border-border rounded-2xl p-4">
                      {render(product)}
                    </div>
                  ))}
                  {!atMax && Array.from({ length: 4 - count }).map((_, i) => (
                    <div key={i} className="border-2 border-dashed border-border rounded-2xl p-4" />
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
