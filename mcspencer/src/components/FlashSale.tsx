import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, ShoppingCart, Check, Clock } from "lucide-react";
import { useLocation } from "wouter";
import { products, Product } from "../lib/data";
import { formatZAR } from "../lib/currency";

interface SaleItem {
  productId: string;
  discountPct: number;
}

const SALE_ITEMS: SaleItem[] = [
  { productId: "4",  discountPct: 20 },
  { productId: "6",  discountPct: 15 },
  { productId: "17", discountPct: 25 },
  { productId: "18", discountPct: 30 },
];

const SALE_END_HOURS = 5;

function useCountdown(hoursFromNow: number) {
  const endTime = React.useRef(Date.now() + hoursFromNow * 3600 * 1000);
  const [remaining, setRemaining] = useState(endTime.current - Date.now());

  useEffect(() => {
    const tick = setInterval(() => {
      const diff = endTime.current - Date.now();
      setRemaining(diff > 0 ? diff : 0);
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  const h = Math.floor(remaining / 3600000);
  const m = Math.floor((remaining % 3600000) / 60000);
  const s = Math.floor((remaining % 60000) / 1000);
  return { h, m, s };
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="bg-white/15 backdrop-blur text-white font-black text-2xl md:text-3xl tabular-nums w-14 md:w-16 h-14 md:h-16 flex items-center justify-center rounded-xl border border-white/20 shadow-inner">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] font-bold uppercase tracking-wider text-white/60 mt-1">{label}</span>
    </div>
  );
}

function FlashCard({ item, onAdd }: { item: SaleItem; onAdd: (p: Product) => void }) {
  const [added, setAdded] = useState(false);
  const [, setLocation] = useLocation();
  const product = products.find((p) => p.id === item.productId);
  if (!product) return null;

  const salePrice = Math.round(product.price * (1 - item.discountPct / 100));

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAdd(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={() => setLocation(`/product/${product.id}`)}
      className="bg-white rounded-2xl overflow-hidden flex flex-col cursor-pointer group border-2 border-transparent hover:border-orange-400 transition-all shadow-md hover:shadow-xl"
    >
      {/* Image */}
      <div className="relative h-[180px] overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.07]"
        />
        {/* Discount badge */}
        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-md animate-pulse">
          -{item.discountPct}%
        </div>
        {/* Category badge */}
        <span className="absolute top-3 right-3 text-[10px] font-bold bg-[hsl(86,72%,45%)] text-white px-2 py-0.5 rounded-full">
          {product.category}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-bold text-sm text-[hsl(222,62%,28%)] line-clamp-2 mb-3 group-hover:text-[hsl(86,72%,38%)] transition-colors">
          {product.name}
        </h3>
        <div className="mt-auto flex items-end justify-between gap-2">
          <div>
            <p className="text-xs text-muted-foreground line-through">{formatZAR(product.price)}</p>
            <p className="text-lg font-black text-red-600">{formatZAR(salePrice)}</p>
          </div>
          <button
            onClick={handleAdd}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              added ? "bg-green-600 text-white" : "bg-red-500 hover:bg-red-600 text-white"
            }`}
          >
            {added
              ? <><Check className="w-3.5 h-3.5" /> Added</>
              : <><ShoppingCart className="w-3.5 h-3.5" /> Add</>}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function FlashSale({ onAddToCart }: { onAddToCart: (p: Product) => void }) {
  const { h, m, s } = useCountdown(SALE_END_HOURS);

  return (
    <section
      className="py-20 px-6 bg-gradient-to-br from-[hsl(222,62%,22%)] via-[hsl(222,62%,18%)] to-[hsl(222,62%,14%)]"
      data-testid="section-flash-sale"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-orange-400 mb-3">
              <Zap className="w-3.5 h-3.5 fill-orange-400" /> Limited Time
            </span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
              Flash Sale
            </h2>
            <p className="text-white/60 mt-2 text-base">
              Massive savings — today only. Don't miss these deals!
            </p>
          </div>

          {/* Countdown */}
          <div className="flex flex-col items-start lg:items-end gap-2">
            <div className="flex items-center gap-1.5 text-orange-400 text-xs font-bold uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5" /> Ends in
            </div>
            <div className="flex items-center gap-2">
              <TimeBlock value={h} label="hrs" />
              <span className="text-white/60 font-black text-2xl -mt-4">:</span>
              <TimeBlock value={m} label="min" />
              <span className="text-white/60 font-black text-2xl -mt-4">:</span>
              <TimeBlock value={s} label="sec" />
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SALE_ITEMS.map((item, i) => (
            <motion.div
              key={item.productId}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <FlashCard item={item} onAdd={onAddToCart} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
