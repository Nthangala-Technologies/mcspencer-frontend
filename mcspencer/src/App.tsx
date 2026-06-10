import React, { useState } from "react";
import { Switch, Route } from "wouter";
import { useCart } from "./hooks/useCart";
import { Category } from "./lib/data";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Categories } from "./components/Categories";
import { PersonalizedRecommendations } from "./components/PersonalizedRecommendations";
import { FlashSale } from "./components/FlashSale";
import { TrendingProducts } from "./components/TrendingProducts";
import { ShopByBrand } from "./components/ShopByBrand";
import { CartDrawer } from "./components/CartDrawer";
import { Footer } from "./components/Footer";
import { ProductDetail } from "./pages/ProductDetail";
import { Checkout } from "./pages/Checkout";
import { Support } from "./pages/Support";
import { Shop } from "./pages/Shop";
import { Wishlist } from "./pages/Wishlist";
import { Compare } from "./pages/Compare";
import { AdminPanel } from "./pages/AdminPanel";
import { WishlistProvider } from "./contexts/WishlistContext";
import { CompareProvider } from "./contexts/CompareContext";

function SharedShell({ children, itemCount, onCartClick, items, updateQuantity, removeFromCart, cartTotal, isDrawerOpen, setIsDrawerOpen }: {
  children: React.ReactNode;
  itemCount: number;
  onCartClick: () => void;
  items: ReturnType<typeof useCart>["items"];
  updateQuantity: ReturnType<typeof useCart>["updateQuantity"];
  removeFromCart: ReturnType<typeof useCart>["removeFromCart"];
  cartTotal: number;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (v: boolean) => void;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar itemCount={itemCount} onCartClick={onCartClick} />
      {children}
      <CartDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        items={items}
        updateQuantity={updateQuantity}
        removeItem={removeFromCart}
        total={cartTotal}
      />
    </div>
  );
}

function HomePage({
  selectedCategory,
  onSelectCategory,
  onAddToCart,
  itemCount,
  onCartClick,
  items,
  updateQuantity,
  removeFromCart,
  cartTotal,
  isDrawerOpen,
  setIsDrawerOpen,
}: {
  selectedCategory: Category | null;
  onSelectCategory: (cat: Category | null) => void;
  onAddToCart: ReturnType<typeof useCart>["addToCart"];
  itemCount: number;
  onCartClick: () => void;
  items: ReturnType<typeof useCart>["items"];
  updateQuantity: ReturnType<typeof useCart>["updateQuantity"];
  removeFromCart: ReturnType<typeof useCart>["removeFromCart"];
  cartTotal: number;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (v: boolean) => void;
}) {
  return (
    <SharedShell
      itemCount={itemCount} onCartClick={onCartClick} items={items}
      updateQuantity={updateQuantity} removeFromCart={removeFromCart}
      cartTotal={cartTotal} isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen}
    >
      <main className="pb-16 md:pb-0">
        <Hero />
        <Categories selectedCategory={selectedCategory} onSelectCategory={onSelectCategory} />
        <PersonalizedRecommendations onAddToCart={onAddToCart} />
        <FlashSale onAddToCart={onAddToCart} />
        <TrendingProducts onAddToCart={onAddToCart} />
        <ShopByBrand />
      </main>
      <Footer />
    </SharedShell>
  );
}

function App() {
  const {
    items, addToCart, updateQuantity, removeFromCart, clearCart,
    cartTotal, itemCount, isDrawerOpen, setIsDrawerOpen,
  } = useCart();

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const shellProps = {
    itemCount, onCartClick: () => setIsDrawerOpen(true), items,
    updateQuantity, removeFromCart, cartTotal, isDrawerOpen, setIsDrawerOpen,
  };

  return (
    <WishlistProvider>
      <CompareProvider>
        <Switch>
          <Route path="/product/:id">
            {() => (
              <SharedShell {...shellProps}>
                <ProductDetail onAddToCart={addToCart} />
              </SharedShell>
            )}
          </Route>

          <Route path="/checkout">
            {() => (
              <Checkout items={items} total={cartTotal} onOrderComplete={clearCart} />
            )}
          </Route>

          <Route path="/support">
            {() => (
              <SharedShell {...shellProps}>
                <Support />
                <Footer />
              </SharedShell>
            )}
          </Route>

          <Route path="/shop">
            {() => (
              <SharedShell {...shellProps}>
                <Shop onAddToCart={addToCart} />
                <Footer />
              </SharedShell>
            )}
          </Route>

          <Route path="/wishlist">
            {() => (
              <SharedShell {...shellProps}>
                <Wishlist onAddToCart={addToCart} />
                <Footer />
              </SharedShell>
            )}
          </Route>

          <Route path="/compare">
            {() => (
              <SharedShell {...shellProps}>
                <Compare onAddToCart={addToCart} />
                <Footer />
              </SharedShell>
            )}
          </Route>

          <Route path="/mcspencer-admin-2001">
            {() => (
              <SharedShell {...shellProps}>
                <AdminPanel />
              </SharedShell>
            )}
          </Route>

          <Route>
            {() => (
              <HomePage
                selectedCategory={selectedCategory}
                onSelectCategory={(cat) => {
                  setSelectedCategory(cat);
                  setTimeout(() => {
                    document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
                  }, 50);
                }}
                onAddToCart={addToCart}
                {...shellProps}
              />
            )}
          </Route>
        </Switch>
      </CompareProvider>
    </WishlistProvider>
  );
}

export default App;
