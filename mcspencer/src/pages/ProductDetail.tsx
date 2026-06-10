import React, { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ShoppingCart, ArrowLeft, Check, Eye } from "lucide-react";
import { products, Product } from "../lib/data";
import { formatZAR } from "../lib/currency";

interface ProductDetailProps {
  onAddToCart: (product: Product) => void;
}

export function ProductDetail({ onAddToCart }: ProductDetailProps) {
  const [, params] = useRoute("/product/:id");
  const [, setLocation] = useLocation();
  const [activeImage, setActiveImage] = useState(0);
  const [direction, setDirection] = useState(0);
  const [added, setAdded] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [params?.id]);

  const product = products.find((p) => p.id === params?.id);

  const related = product
    ? products
        .filter((p) => p.id !== product.id && p.category === product.category)
        .slice(0, 4)
        .concat(
          products
            .filter((p) => p.id !== product.id && p.category !== product.category)
            .slice(0, Math.max(0, 4 - products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4).length))
        )
        .slice(0, 4)
    : [];

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <button onClick={() => setLocation("/")} className="text-muted-foreground hover:text-foreground underline">
            Back to shop
          </button>
        </div>
      </div>
    );
  }

  const images = product.images;
  const totalImages = images.length;

  const go = (next: number) => {
    setDirection(next > activeImage ? 1 : -1);
    setActiveImage(next);
  };

  const prev = () => go(activeImage === 0 ? totalImages - 1 : activeImage - 1);
  const next = () => go(activeImage === totalImages - 1 ? 0 : activeImage + 1);

  const handleAdd = () => {
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleAddRelated = (p: Product) => {
    onAddToCart(p);
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1600);
  };

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-28 md:pb-24">
      {/* Back */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <button
          onClick={() => setLocation("/")}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[hsl(222,62%,28%)] transition-colors group font-medium"
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to shop
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Product layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">

          {/* ── Image slider ── */}
          <div className="space-y-4" data-testid="section-product-images">
            {/* Main image */}
            <div className="relative rounded-2xl overflow-hidden bg-muted aspect-[4/3] select-none border border-border">
              <AnimatePresence initial={false} custom={direction}>
                <motion.img
                  key={activeImage}
                  src={images[activeImage]}
                  alt={`${product.name} — image ${activeImage + 1}`}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.36, ease: [0.32, 0, 0.67, 0] }}
                  className="absolute inset-0 w-full h-full object-cover"
                  data-testid={`img-slide-${activeImage}`}
                />
              </AnimatePresence>

              {totalImages > 1 && (
                <>
                  <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white text-[hsl(222,62%,28%)] transition-colors z-10" data-testid="button-slide-prev">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white text-[hsl(222,62%,28%)] transition-colors z-10" data-testid="button-slide-next">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => go(i)}
                    className={`rounded-full transition-all duration-300 ${i === activeImage ? "w-5 h-2 bg-[hsl(86,72%,45%)]" : "w-2 h-2 bg-white/60 hover:bg-white/90"}`}
                    data-testid={`button-dot-${i}`}
                  />
                ))}
              </div>

              {/* Counter */}
              <div className="absolute top-3 right-3 bg-[hsl(222,62%,28%)]/80 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full z-10">
                {activeImage + 1} / {totalImages}
              </div>

              {/* Category badge */}
              <span className="absolute top-3 left-3 bg-[hsl(86,72%,45%)] text-white text-[11px] font-bold px-3 py-1 rounded-full z-10 shadow">
                {product.category}
              </span>
            </div>

            {/* Thumbnails */}
            {totalImages > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => go(i)}
                    className={`flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 ${i === activeImage ? "border-[hsl(86,72%,45%)] opacity-100 shadow-md" : "border-transparent opacity-50 hover:opacity-80"}`}
                    data-testid={`button-thumb-${i}`}
                  >
                    <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product info ── */}
          <div className="flex flex-col" data-testid="section-product-info">
            <span className="inline-flex self-start bg-[hsl(86,72%,45%)] text-white text-[11px] font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest shadow">
              {product.category}
            </span>

            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3 text-[hsl(222,62%,28%)]" data-testid="text-detail-name">
              {product.name}
            </h1>

            <p className="text-3xl font-black text-[hsl(222,62%,28%)] mb-6" data-testid="text-detail-price">
              {formatZAR(product.price)}
            </p>

            <p className="text-muted-foreground text-base leading-relaxed mb-8" data-testid="text-detail-description">
              {product.description}
            </p>

            {/* Highlights */}
            {product.details && product.details.length > 0 && (
              <div className="bg-[hsl(222,62%,28%)]/4 border border-[hsl(222,62%,28%)]/10 rounded-2xl p-5 mb-8">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[hsl(222,62%,28%)] mb-4">
                  Highlights
                </h3>
                <ul className="space-y-2.5">
                  {product.details.map((detail, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <span className="w-5 h-5 flex-shrink-0 rounded-full bg-[hsl(86,72%,45%)] flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </span>
                      <span className="text-foreground font-medium">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA */}
            <div className="mt-auto space-y-3">
              <button
                onClick={handleAdd}
                className={`w-full py-4 px-8 rounded-full font-black text-base transition-all flex items-center justify-center gap-2 shadow-md ${
                  added ? "bg-green-600 text-white" : "btn-primary"
                }`}
                data-testid="button-detail-add-cart"
              >
                {added ? (
                  <><Check className="w-5 h-5" /> Added to Bag</>
                ) : (
                  <><ShoppingCart className="w-5 h-5" /> Add to Bag — {formatZAR(product.price)}</>
                )}
              </button>

              <p className="text-xs text-center text-muted-foreground">
                Free delivery on orders over R 5 000. Free 14-day returns.
              </p>
            </div>
          </div>
        </div>

        {/* ── Related Products ── */}
        {related.length > 0 && (
          <div className="mt-20 mb-6">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-1 w-8 rounded-full bg-[hsl(86,72%,45%)]" />
              <h2 className="text-2xl font-black tracking-tight text-[hsl(222,62%,28%)]">You May Also Like</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="card-fancy group bg-card border border-border rounded-2xl overflow-hidden cursor-pointer"
                  onClick={() => { setActiveImage(0); setLocation(`/product/${p.id}`); }}
                  data-testid={`related-card-${p.id}`}
                >
                  <div className="relative h-44 overflow-hidden bg-muted">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.07]"
                    />
                    <span className="absolute top-2 left-2 bg-[hsl(86,72%,45%)] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      {p.category}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm text-[hsl(222,62%,28%)] mb-1 line-clamp-2 group-hover:text-[hsl(86,72%,38%)] transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-[hsl(222,62%,28%)] font-black text-base mb-3">{formatZAR(p.price)}</p>
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => { setActiveImage(0); setLocation(`/product/${p.id}`); }}
                        className="flex-1 flex items-center justify-center gap-1 py-2 rounded-full border-2 border-[hsl(222,62%,28%)]/20 hover:border-[hsl(222,62%,28%)] text-[hsl(222,62%,28%)] text-xs font-semibold transition-all"
                        data-testid={`button-related-view-${p.id}`}
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                      <button
                        onClick={() => handleAddRelated(p)}
                        className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-full text-xs font-bold transition-all ${
                          addedId === p.id ? "bg-green-600 text-white" : "btn-primary"
                        }`}
                        data-testid={`button-related-add-${p.id}`}
                      >
                        {addedId === p.id ? <><Check className="w-3.5 h-3.5" /> Added</> : <><ShoppingCart className="w-3.5 h-3.5" /> Add</>}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
