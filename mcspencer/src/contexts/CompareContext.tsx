import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Product } from "../lib/data";

const MAX_COMPARE = 4;

interface CompareCtx {
  compareList: Product[];
  inCompare: (id: string) => boolean;
  toggleCompare: (product: Product) => void;
  clearCompare: () => void;
  count: number;
  atMax: boolean;
}

const CompareContext = createContext<CompareCtx>({
  compareList: [],
  inCompare: () => false,
  toggleCompare: () => {},
  clearCompare: () => {},
  count: 0,
  atMax: false,
});

const KEY = "mcspencer_compare";

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareList, setCompareList] = useState<Product[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY) ?? "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(compareList));
  }, [compareList]);

  const inCompare = useCallback((id: string) => compareList.some((p) => p.id === id), [compareList]);

  const toggleCompare = useCallback((product: Product) => {
    setCompareList((prev) => {
      if (prev.some((p) => p.id === product.id)) return prev.filter((p) => p.id !== product.id);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, product];
    });
  }, []);

  const clearCompare = useCallback(() => setCompareList([]), []);

  return (
    <CompareContext.Provider
      value={{ compareList, inCompare, toggleCompare, clearCompare, count: compareList.length, atMax: compareList.length >= MAX_COMPARE }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export const useCompare = () => useContext(CompareContext);
