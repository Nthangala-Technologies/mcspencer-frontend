import React, { useState, useMemo, useCallback } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, SlidersHorizontal, X, ChevronDown, ChevronUp,
  LayoutGrid, List, ShoppingCart, ArrowUpDown, Check, RotateCcw,
} from "lucide-react";
import { products, categories, Category, Product } from "../lib/data";
import { formatZAR } from "../lib/currency";
import { ProductCard } from "../components/ProductCard";

const MIN_PRICE = 0;
const MAX_PRICE = 25000;

const SORT_OPTIONS = [
  { value: "default",   label: "Featured" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc",label: "Price: High → Low" },
  { value: "name-asc",  label: "Name: A → Z" },
  { value: "name-desc", label: "Name: Z → A" },
];

interface Filters {
  search: string;
  categories: Category[];
  minPrice: number;
  maxPrice: number;
  sort: string;
}

const defaultFilters: Filters = {
  search: "",
  categories: [],
  minPrice: MIN_PRICE,
  maxPrice: MAX_PRICE,
  sort: "default",
};

function isDefault(f: Filters) {
  return (
    f.search === "" &&
    f.categories.length === 0 &&
    f.minPrice === MIN_PRICE &&
    f.maxPrice === MAX_PRICE &&
    f.sort === "default"
  );
}

function applyFilters(list: Product[], f: Filters): Product[] {
  let out = list;
  if (f.search.trim()) {
    const q = f.search.toLowerCase();
    out = out.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }
  if (f.categories.length > 0) {
    out = out.filter((p) => f.categories.includes(p.category));
  }
  out = out.filter((p) => p.price >= f.minPrice && p.price <= f.maxPrice);
  switch (f.sort) {
    case "price-asc":  out = [...out].sort((a, b) => a.price - b.price); break;
    case "price-desc": out = [...out].sort((a, b) => b.price - a.price); break;
    case "name-asc":   out = [...out].sort((a, b) => a.name.localeCompare(b.name)); break;
    case "name-desc":  out = [...out].sort((a, b) => b.name.localeCompare(a.name)); break;
  }
  return out;
}

// ── Price range slider (two thumbs) ─────────────────────────────────────────
function PriceRange({
  min, max, onMin, onMax,
}: {
  min: number; max: number;
  onMin: (v: number) => void; onMax: (v: number) => void;
}) {
  const pct = (v: number) => ((v - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;
  return (
    <div className="space-y-3">
      <div className="relative h-2 rounded-full bg-border mx-1">
        <div
          className="absolute h-full rounded-full bg-[hsl(86,72%,45%)]"
          style={{ left: `${pct(min)}%`, right: `${100 - pct(max)}%` }}
        />
        <input
          type="range" min={MIN_PRICE} max={MAX_PRICE} step={100}
          value={min}
          onChange={(e) => { const v = +e.target.value; if (v <= max - 100) onMin(v); }}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
          style={{ zIndex: min > MAX_PRICE - 1000 ? 5 : 3 }}
        />
        <input
          type="range" min={MIN_PRICE} max={MAX_PRICE} step={100}
          value={max}
          onChange={(e) => { const v = +e.target.value; if (v >= min + 100) onMax(v); }}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
          style={{ zIndex: 4 }}
        />
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground mb-1 block">Min (R)</label>
          <input
            type="number" min={MIN_PRICE} max={max - 100} step={100}
            value={min}
            onChange={(e) => { const v = Math.max(MIN_PRICE, Math.min(+e.target.value, max - 100)); onMin(v); }}
            className="w-full border-2 border-border rounded-lg px-2 py-1.5 text-xs font-mono focus:outline-none focus:border-[hsl(222,62%,28%)] bg-background"
          />
        </div>
        <div className="flex-1">
          <label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground mb-1 block">Max (R)</label>
          <input
            type="number" min={min + 100} max={MAX_PRICE} step={100}
            value={max}
            onChange={(e) => { const v = Math.min(MAX_PRICE, Math.max(+e.target.value, min + 100)); onMax(v); }}
            className="w-full border-2 border-border rounded-lg px-2 py-1.5 text-xs font-mono focus:outline-none focus:border-[hsl(222,62%,28%)] bg-background"
          />
        </div>
      </div>
    </div>
  );
}

// ── Collapsible filter section ───────────────────────────────────────────────
function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full mb-3 group"
      >
        <span className="text-xs font-black uppercase tracking-widest text-[hsl(222,62%,28%)] group-hover:text-[hsl(86,72%,38%)] transition-colors">
          {title}
        </span>
        {open ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}

// ── Sidebar panel (shared desktop + mobile) ──────────────────────────────────
function FilterPanel({
  filters,
  onChange,
  onReset,
  resultCount,
}: {
  filters: Filters;
  onChange: (patch: Partial<Filters>) => void;
  onReset: () => void;
  resultCount: number;
}) {
  const toggleCat = (cat: Category) =>
    onChange({
      categories: filters.categories.includes(cat)
        ? filters.categories.filter((c) => c !== cat)
        : [...filters.categories, cat],
    });

  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="font-black text-[hsl(222,62%,28%)] text-sm">Filters</p>
          <p className="text-xs text-muted-foreground mt-0.5">{resultCount} result{resultCount !== 1 ? "s" : ""}</p>
        </div>
        {!isDefault(filters) && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs font-semibold text-[hsl(86,72%,38%)] hover:underline"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>

      {/* Search */}
      <FilterSection title="Search">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Product name, keyword…"
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            className="w-full border-2 border-border rounded-xl pl-9 pr-9 py-2.5 text-sm focus:outline-none focus:border-[hsl(222,62%,28%)] bg-background transition-colors"
          />
          {filters.search && (
            <button onClick={() => onChange({ search: "" })} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
      </FilterSection>

      {/* Category */}
      <FilterSection title="Category">
        <div className="space-y-1.5">
          {categories.map(({ name }) => {
            const count = products.filter((p) => p.category === name).length;
            const active = filters.categories.includes(name);
            return (
              <button
                key={name}
                onClick={() => toggleCat(name)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-[hsl(222,62%,28%)] text-white"
                    : "hover:bg-muted text-foreground"
                }`}
              >
                <span>{name}</span>
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${active ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* Price range */}
      <FilterSection title="Price Range">
        <PriceRange
          min={filters.minPrice}
          max={filters.maxPrice}
          onMin={(v) => onChange({ minPrice: v })}
          onMax={(v) => onChange({ maxPrice: v })}
        />
        <p className="text-xs text-muted-foreground mt-2 text-center">
          {formatZAR(filters.minPrice)} — {formatZAR(filters.maxPrice)}
        </p>
      </FilterSection>

      {/* Sort */}
      <FilterSection title="Sort By" defaultOpen={true}>
        <div className="space-y-1">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange({ sort: opt.value })}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                filters.sort === opt.value
                  ? "bg-[hsl(86,72%,45%)] text-white"
                  : "hover:bg-muted text-foreground"
              }`}
            >
              {filters.sort === opt.value && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
              <span className={filters.sort !== opt.value ? "ml-5" : ""}>{opt.label}</span>
            </button>
          ))}
        </div>
      </FilterSection>
    </div>
  );
}

// ── Active filter chips ───────────────────────────────────────────────────────
function ActiveChips({ filters, onChange }: { filters: Filters; onChange: (p: Partial<Filters>) => void }) {
  const chips: { label: string; onRemove: () => void }[] = [];
  if (filters.search) chips.push({ label: `"${filters.search}"`, onRemove: () => onChange({ search: "" }) });
  filters.categories.forEach((c) =>
    chips.push({ label: c, onRemove: () => onChange({ categories: filters.categories.filter((x) => x !== c) }) })
  );
  if (filters.minPrice > MIN_PRICE || filters.maxPrice < MAX_PRICE)
    chips.push({
      label: `${formatZAR(filters.minPrice)}–${formatZAR(filters.maxPrice)}`,
      onRemove: () => onChange({ minPrice: MIN_PRICE, maxPrice: MAX_PRICE }),
    });
  if (filters.sort !== "default") {
    const label = SORT_OPTIONS.find((o) => o.value === filters.sort)?.label ?? "";
    chips.push({ label, onRemove: () => onChange({ sort: "default" }) });
  }
  if (!chips.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <span
          key={chip.label}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[hsl(222,62%,28%)]/8 text-[hsl(222,62%,28%)] text-xs font-semibold border border-[hsl(222,62%,28%)]/20"
        >
          {chip.label}
          <button onClick={chip.onRemove} className="hover:text-red-500 transition-colors">
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
    </div>
  );
}

// ── Main Shop page ────────────────────────────────────────────────────────────
export function Shop({ onAddToCart }: { onAddToCart: (p: Product) => void }) {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [mobileOpen, setMobileOpen] = useState(false);

  const patch = useCallback((p: Partial<Filters>) => setFilters((f) => ({ ...f, ...p })), []);
  const reset = useCallback(() => setFilters(defaultFilters), []);

  const results = useMemo(() => applyFilters(products, filters), [filters]);

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen bg-muted/30 pt-16 pb-24 md:pb-6">
      {/* Page header */}
      <div className="bg-[hsl(222,62%,28%)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-1">Shop</h1>
          <p className="text-white/60 text-sm">
            {products.length} products across {categories.length} categories
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-8">

          {/* ── Desktop sidebar ── */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white border-2 border-border rounded-2xl p-5 sticky top-24">
              <FilterPanel filters={filters} onChange={patch} onReset={reset} resultCount={results.length} />
            </div>
          </aside>

          {/* ── Main content ── */}
          <div className="flex-1 min-w-0">

            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              {/* Mobile filter button */}
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-border bg-white text-sm font-semibold text-[hsl(222,62%,28%)] hover:border-[hsl(222,62%,28%)] transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {!isDefault(filters) && (
                  <span className="w-5 h-5 rounded-full bg-[hsl(86,72%,45%)] text-white text-[10px] font-black flex items-center justify-center">
                    {[
                      filters.search ? 1 : 0,
                      filters.categories.length,
                      (filters.minPrice > MIN_PRICE || filters.maxPrice < MAX_PRICE) ? 1 : 0,
                      filters.sort !== "default" ? 1 : 0,
                    ].reduce((a, b) => a + b, 0)}
                  </span>
                )}
              </button>

              {/* Result count */}
              <p className="text-sm text-muted-foreground hidden lg:block">
                Showing <span className="font-bold text-foreground">{results.length}</span> of {products.length} products
              </p>

              {/* Right controls */}
              <div className="flex items-center gap-2 ml-auto">
                {/* Sort (desktop quick) */}
                <div className="hidden sm:flex items-center gap-2 bg-white border-2 border-border rounded-xl px-3 py-2">
                  <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
                  <select
                    value={filters.sort}
                    onChange={(e) => patch({ sort: e.target.value })}
                    className="text-sm font-semibold bg-transparent focus:outline-none text-[hsl(222,62%,28%)] pr-1"
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>

                {/* View toggle */}
                <div className="flex items-center border-2 border-border rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setView("grid")}
                    className={`p-2.5 transition-colors ${view === "grid" ? "bg-[hsl(222,62%,28%)] text-white" : "text-muted-foreground hover:bg-muted"}`}
                    title="Grid view"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setView("list")}
                    className={`p-2.5 transition-colors ${view === "list" ? "bg-[hsl(222,62%,28%)] text-white" : "text-muted-foreground hover:bg-muted"}`}
                    title="List view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active chips */}
            {!isDefault(filters) && (
              <div className="mb-4">
                <ActiveChips filters={filters} onChange={patch} />
              </div>
            )}

            {/* Results */}
            {results.length === 0 ? (
              <div className="bg-white border-2 border-border rounded-2xl py-24 text-center">
                <p className="text-4xl mb-4">🔍</p>
                <p className="font-bold text-[hsl(222,62%,28%)] mb-1">No products match your filters</p>
                <p className="text-sm text-muted-foreground mb-6">Try adjusting your search or price range.</p>
                <button
                  onClick={reset}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full btn-primary font-bold text-sm"
                >
                  <RotateCcw className="w-4 h-4" /> Clear all filters
                </button>
              </div>
            ) : view === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {results.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <ProductCard product={p} onAdd={onAddToCart} />
                  </motion.div>
                ))}
              </div>
            ) : (
              /* List view */
              <div className="space-y-3">
                {results.map((p, i) => (
                  <ListRow key={p.id} product={p} onAdd={onAddToCart} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile filter drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-80 max-w-[90vw] bg-white z-50 lg:hidden flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <p className="font-black text-[hsl(222,62%,28%)]">Filter Products</p>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5">
                <FilterPanel filters={filters} onChange={patch} onReset={reset} resultCount={results.length} />
              </div>
              <div className="p-4 border-t border-border">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-full py-3.5 rounded-full btn-primary font-black text-sm"
                >
                  Show {results.length} result{results.length !== 1 ? "s" : ""}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── List view row ─────────────────────────────────────────────────────────────
function ListRow({ product, onAdd, index }: { product: Product; onAdd: (p: Product) => void; index: number }) {
  const [added, setAdded] = useState(false);
  const [, navigate] = useLocation();

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAdd(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.03 }}
      onClick={() => navigate(`/product/${product.id}`)}
      className="bg-white border-2 border-border rounded-2xl flex gap-4 p-4 cursor-pointer hover:border-[hsl(86,72%,45%)] hover:shadow-md transition-all group"
    >
      <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.07]"
        />
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <span className="inline-block text-[10px] font-bold bg-[hsl(86,72%,45%)] text-white px-2 py-0.5 rounded-full mb-1">
            {product.category}
          </span>
          <h3 className="font-bold text-sm text-[hsl(222,62%,28%)] group-hover:text-[hsl(86,72%,38%)] transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5 leading-relaxed">
            {product.description}
          </p>
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-base font-black text-[hsl(222,62%,28%)]">{formatZAR(product.price)}</p>
          <button
            onClick={handleAdd}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              added ? "bg-green-600 text-white" : "btn-primary"
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
