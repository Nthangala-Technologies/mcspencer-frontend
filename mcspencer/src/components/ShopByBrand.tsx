import React from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Tag } from "lucide-react";

interface Brand {
  name: string;
  tagline: string;
  category: string;
  logo: string;
  bg: string;
  accent: string;
}

const brands: Brand[] = [
  {
    name: "Samsung",
    tagline: "Do What You Can't",
    category: "Electronics",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg",
    bg: "bg-blue-50",
    accent: "border-blue-200",
  },
  {
    name: "Sony",
    tagline: "Be Moved",
    category: "Electronics",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg",
    bg: "bg-slate-50",
    accent: "border-slate-200",
  },
  {
    name: "Bosch",
    tagline: "Invented for Life",
    category: "Hardware",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/09/Bosch-brand-wheel-01.png",
    bg: "bg-red-50",
    accent: "border-red-200",
  },
  {
    name: "Makita",
    tagline: "Built for Pros",
    category: "Hardware",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Makita_logo.svg",
    bg: "bg-teal-50",
    accent: "border-teal-200",
  },
  {
    name: "Logitech",
    tagline: "Designed for Life",
    category: "Electronics",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/45/Logitech_logo.svg",
    bg: "bg-sky-50",
    accent: "border-sky-200",
  },
  {
    name: "Castrol",
    tagline: "Liquid Engineering",
    category: "Car Spares",
    logo: "https://upload.wikimedia.org/wikipedia/en/2/22/Castrol_logo.svg",
    bg: "bg-green-50",
    accent: "border-green-200",
  },
  {
    name: "Parker",
    tagline: "Make Your Mark",
    category: "Stationery",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Parker_Pen_logo.svg",
    bg: "bg-amber-50",
    accent: "border-amber-200",
  },
  {
    name: "Stanley",
    tagline: "Built for Life",
    category: "Hardware",
    logo: "https://upload.wikimedia.org/wikipedia/commons/d/d6/Stanley_Black_%26_Decker_logo.svg",
    bg: "bg-yellow-50",
    accent: "border-yellow-200",
  },
];

export function ShopByBrand() {
  const [, setLocation] = useLocation();

  return (
    <section className="py-20 px-6 bg-background" data-testid="section-brands">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[hsl(86,72%,38%)] mb-3">
            <Tag className="w-3.5 h-3.5" /> Top Brands
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[hsl(222,62%,28%)]">
            Shop by Brand
          </h2>
          <p className="text-muted-foreground mt-2 text-base max-w-xl mx-auto">
            Trusted names in electronics, tools, automotive and stationery — all stocked and ready to ship across SA.
          </p>
        </div>

        {/* Brand grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {brands.map((brand, i) => (
            <motion.button
              key={brand.name}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(0,0,0,0.10)" }}
              onClick={() => setLocation("/shop")}
              className={`group ${brand.bg} border-2 ${brand.accent} rounded-2xl p-5 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[hsl(222,62%,28%)] transition-all`}
            >
              <div className="h-10 flex items-center justify-center">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="max-h-9 max-w-[100px] object-contain"
                  onError={(e) => {
                    const el = e.currentTarget;
                    el.style.display = "none";
                    const fallback = el.parentElement?.querySelector(".brand-fallback") as HTMLElement | null;
                    if (fallback) fallback.style.display = "block";
                  }}
                />
                <span
                  className="brand-fallback hidden font-black text-lg text-[hsl(222,62%,28%)]"
                >
                  {brand.name}
                </span>
              </div>
              <div className="text-center">
                <p className="font-black text-sm text-[hsl(222,62%,28%)] group-hover:text-[hsl(86,72%,38%)] transition-colors">
                  {brand.name}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{brand.tagline}</p>
              </div>
              <span className="text-[10px] font-bold bg-white/60 text-muted-foreground px-2.5 py-0.5 rounded-full border border-border/40">
                {brand.category}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
