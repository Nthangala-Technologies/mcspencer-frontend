import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Trash2, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { useWishlist } from "../contexts/WishlistContext";
import { ProductCard } from "../components/ProductCard";
import { Product } from "../lib/data";

export function Wishlist({ onAddToCart }: { onAddToCart: (p: Product) => void }) {
  const { wishlist, toggleWishlist, count } = useWishlist();
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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/20 border border-red-400/40 flex items-center justify-center">
              <Heart className="w-5 h-5 fill-red-400 text-red-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">My Wishlist</h1>
              <p className="text-white/60 text-sm mt-0.5">{count} saved item{count !== 1 ? "s" : ""}</p>
            </div>
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
            <div className="w-20 h-20 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center mx-auto mb-5">
              <Heart className="w-9 h-9 text-red-300" />
            </div>
            <p className="font-black text-[hsl(222,62%,28%)] text-xl mb-2">Your wishlist is empty</p>
            <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto">
              Tap the heart icon on any product to save it here for later.
            </p>
            <button
              onClick={() => setLocation("/shop")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full btn-primary font-bold text-sm"
            >
              <ShoppingBag className="w-4 h-4" /> Browse Products
            </button>
          </motion.div>
        ) : (
          <>
            {/* Clear all */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-bold text-foreground">{count}</span> saved item{count !== 1 ? "s" : ""}
              </p>
              <button
                onClick={() => wishlist.forEach((p) => toggleWishlist(p))}
                className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-700 hover:underline transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear all
              </button>
            </div>

            <AnimatePresence mode="popLayout">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                {wishlist.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.35, delay: i * 0.05 }}
                    layout
                  >
                    <ProductCard product={product} onAdd={onAddToCart} />
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}
