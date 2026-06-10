import React, { useState } from "react";
import { useLocation } from "wouter";
import { Product } from "../lib/data";
import { formatZAR } from "../lib/currency";
import { motion } from "framer-motion";
import { ShoppingCart, Eye, Check, Heart, GitCompare } from "lucide-react";
import { useWishlist } from "../contexts/WishlistContext";
import { useCompare } from "../contexts/CompareContext";

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
  featured?: boolean;
}

export function ProductCard({ product, onAdd, featured = false }: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const [, setLocation] = useLocation();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { inCompare, toggleCompare, atMax } = useCompare();

  const wishlisted = isWishlisted(product.id);
  const compared = inCompare(product.id);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAdd(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const handleView = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLocation(`/product/${product.id}`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!compared && atMax) return;
    toggleCompare(product);
  };

  if (featured) {
    return (
      <motion.div
        whileHover={{ y: -3 }}
        className="card-fancy group bg-card rounded-2xl overflow-hidden flex flex-col md:flex-row md:items-center shadow-md border border-border cursor-pointer"
        onClick={() => handleView()}
        data-testid={`card-product-${product.id}`}
      >
        <div className="overflow-hidden bg-muted relative md:w-1/2 h-[300px] md:h-[400px]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
            data-testid={`img-product-${product.id}`}
          />
          <span className="absolute top-3 left-3 text-[11px] font-bold bg-[hsl(86,72%,45%)] text-white px-3 py-1 rounded-full shadow">
            {product.category}
          </span>
          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all ${wishlisted ? "bg-red-500" : "bg-white hover:bg-red-50"}`}
          >
            <Heart className={`w-4 h-4 ${wishlisted ? "fill-white text-white" : "text-red-400"}`} />
          </button>
        </div>
        <div className="flex flex-col flex-1 p-8 md:p-12 md:w-1/2">
          <h3 className="text-3xl font-bold tracking-tight mb-3 text-[hsl(222,62%,28%)]" data-testid={`text-product-name-${product.id}`}>
            {product.name}
          </h3>
          <p className="text-muted-foreground text-base mb-8 flex-1 leading-relaxed" data-testid={`text-product-desc-${product.id}`}>
            {product.description}
          </p>
          <div className="flex items-center justify-between gap-4 mt-auto flex-wrap">
            <span className="text-2xl font-bold text-[hsl(222,62%,28%)]" data-testid={`text-product-price-${product.id}`}>
              {formatZAR(product.price)}
            </span>
            <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={handleCompare}
                title={compared ? "Remove from compare" : atMax ? "Compare list full" : "Add to compare"}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all border-2 ${compared ? "bg-[hsl(86,72%,45%)] border-[hsl(86,72%,45%)] text-white" : atMax ? "border-border text-muted-foreground opacity-40 cursor-not-allowed" : "border-[hsl(86,72%,45%)]/30 text-[hsl(86,72%,38%)] hover:border-[hsl(86,72%,45%)] hover:bg-[hsl(86,72%,45%)]/10"}`}
              >
                <GitCompare className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleView()}
                className="px-5 py-3 rounded-full border-2 border-[hsl(222,62%,28%)] text-[hsl(222,62%,28%)] font-semibold text-sm hover:bg-[hsl(222,62%,28%)] hover:text-white transition-all duration-200"
                data-testid={`button-view-details-${product.id}`}
              >
                Details
              </button>
              <button
                onClick={handleAdd}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-200 ${
                  added ? "bg-green-600 text-white shadow-lg" : "btn-primary"
                }`}
                data-testid={`button-add-cart-${product.id}`}
              >
                {added ? <><Check className="w-4 h-4" /> Added</> : <><ShoppingCart className="w-4 h-4" /> Add to Cart</>}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="card-fancy group bg-card rounded-2xl overflow-hidden flex flex-col cursor-pointer border border-border"
      onClick={() => handleView()}
      data-testid={`card-product-${product.id}`}
    >
      {/* Image area */}
      <div className="relative h-[220px] overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.07]"
          data-testid={`img-product-${product.id}`}
        />

        {/* Category badge */}
        <span className="absolute top-3 left-3 text-[11px] font-bold bg-[hsl(86,72%,45%)] text-white px-2.5 py-1 rounded-full shadow-sm">
          {product.category}
        </span>

        {/* Wishlist heart */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all z-10 ${
            wishlisted ? "bg-red-500" : "bg-white/90 hover:bg-red-50 opacity-0 group-hover:opacity-100"
          }`}
          title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-3.5 h-3.5 ${wishlisted ? "fill-white text-white" : "text-red-400"}`} />
        </button>

        {/* Quick-view overlay on hover */}
        <div className="absolute inset-0 bg-[hsl(222,62%,28%)]/0 group-hover:bg-[hsl(222,62%,28%)]/20 transition-colors duration-300 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-[hsl(222,62%,28%)] font-semibold text-xs px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" /> Quick View
          </span>
        </div>
      </div>

      {/* Content area */}
      <div className="flex flex-col flex-1 p-4 sm:p-5 gap-2 sm:gap-0">
        {/* Row 1 — Title */}
        <h3
          className="font-bold text-sm sm:text-base tracking-tight text-[hsl(222,62%,28%)] group-hover:text-[hsl(86,72%,38%)] transition-colors line-clamp-2"
          data-testid={`text-product-name-${product.id}`}
        >
          {product.name}
        </h3>

        {/* Description — desktop only */}
        <p
          className="hidden sm:block text-muted-foreground text-sm sm:mb-4 flex-1 leading-snug line-clamp-2"
          data-testid={`text-product-desc-${product.id}`}
        >
          {product.description}
        </p>

        {/* Row 2 — Price */}
        <p className="text-lg sm:text-xl font-black text-[hsl(222,62%,28%)]" data-testid={`text-product-price-${product.id}`}>
          {formatZAR(product.price)}
        </p>

        {/* Row 3 — Buttons */}
        <div className="border-t border-border/60 pt-2 sm:pt-3 flex items-center justify-between gap-1.5" onClick={(e) => e.stopPropagation()}>
          {/* Compare */}
          <button
            onClick={handleCompare}
            title={compared ? "Remove from compare" : atMax ? "Compare list full (4 max)" : "Add to compare"}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all border-2 flex-shrink-0 ${
              compared ? "bg-[hsl(86,72%,45%)] border-[hsl(86,72%,45%)] text-white" : atMax ? "border-border text-muted-foreground/40 cursor-not-allowed" : "border-border text-muted-foreground hover:border-[hsl(86,72%,45%)] hover:text-[hsl(86,72%,38%)]"
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
          </button>

          {/* View */}
          <button
            onClick={() => handleView()}
            className="w-8 h-8 rounded-full border-2 border-[hsl(222,62%,28%)]/30 flex items-center justify-center text-[hsl(222,62%,28%)] hover:border-[hsl(222,62%,28%)] hover:bg-[hsl(222,62%,28%)]/8 transition-all flex-shrink-0"
            title="View details"
            data-testid={`button-view-details-${product.id}`}
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Add to cart */}
          <button
            onClick={handleAdd}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full font-semibold text-xs sm:text-sm transition-all duration-200 ${
              added ? "bg-green-600 text-white shadow-md" : "btn-primary"
            }`}
            data-testid={`button-add-cart-${product.id}`}
            >
              {added ? (
                <><Check className="w-3.5 h-3.5" /> Added</>
              ) : (
                <><ShoppingCart className="w-3.5 h-3.5" /> Add</>
              )}
            </button>
        </div>
      </div>
    </motion.div>
  );
}
