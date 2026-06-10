import React from "react";
import { motion } from "framer-motion";
import { Laptop, Wrench, Car, BookOpen, Shirt, Leaf } from "lucide-react";
import { categories, Category } from "../lib/data";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Laptop,
  Wrench,
  Car,
  BookOpen,
  Shirt,
  Leaf,
};

interface CategoriesProps {
  selectedCategory: Category | null;
  onSelectCategory: (cat: Category | null) => void;
}

export function Categories({ selectedCategory, onSelectCategory }: CategoriesProps) {
  return (
    <section id="categories" className="py-20 px-6 bg-background" data-testid="section-categories">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3" data-testid="text-categories-title">
            Featured Categories
          </h2>
          <p className="text-muted-foreground text-lg">Six departments, one destination.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => {
            const Icon = iconMap[cat.icon];
            const isSelected = selectedCategory === cat.name;
            return (
              <motion.button
                key={cat.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => onSelectCategory(isSelected ? null : cat.name)}
                className={`group relative rounded-2xl overflow-hidden aspect-square flex flex-col items-center justify-center gap-3 p-4 cursor-pointer transition-all duration-300 border-2 ${
                  isSelected
                    ? "border-foreground shadow-lg scale-[0.98]"
                    : "border-transparent hover:border-foreground/20 hover:shadow-md"
                }`}
                data-testid={`button-category-${cat.name.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {/* Background image */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 transition-colors duration-300 ${
                    isSelected ? "bg-black/60" : "bg-black/40 group-hover:bg-black/50"
                  }`} />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    isSelected ? "bg-white" : "bg-white/20 group-hover:bg-white/30"
                  }`}>
                    <Icon className={`w-5 h-5 transition-colors ${isSelected ? "text-foreground" : "text-white"}`} />
                  </div>
                  <span className="text-xs font-semibold text-white text-center leading-tight">
                    {cat.name}
                  </span>
                </div>

                {isSelected && (
                  <div className="absolute bottom-2 right-2 z-10 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {selectedCategory && (
          <div className="mt-6 text-center">
            <button
              onClick={() => onSelectCategory(null)}
              className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
              data-testid="button-clear-category"
            >
              Clear filter — show all products
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
