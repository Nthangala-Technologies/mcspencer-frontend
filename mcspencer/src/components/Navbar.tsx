import React from "react";
import { useLocation } from "wouter";
import { ShoppingBag, Home, Grid3X3, HeadphonesIcon, Heart, GitCompare } from "lucide-react";
import { useWishlist } from "../contexts/WishlistContext";
import { useCompare } from "../contexts/CompareContext";
const logoImg = "/logo.jpg";

interface NavbarProps {
  itemCount: number;
  onCartClick: () => void;
}

export function Navbar({ itemCount, onCartClick }: NavbarProps) {
  const [scrolled, setScrolled] = React.useState(false);
  const [, setLocation] = useLocation();
  const { count: wishCount } = useWishlist();
  const { count: compareCount } = useCompare();

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setLocation("/");
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  };

  return (
    <>
      {/* ── Desktop / tablet top navbar ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 backdrop-blur-[20px] bg-white/90 ${
          scrolled ? "border-b border-border shadow-sm" : "border-b border-transparent"
        }`}
        data-testid="navbar"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); setLocation("/"); }}
            className="flex items-center gap-2 flex-shrink-0"
            data-testid="link-home"
          >
            <img
              src={logoImg}
              alt="McSpencer Enterprise"
              className="h-10 w-10 rounded-full object-cover border-2 border-[hsl(86,72%,45%)]"
            />
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-sm font-bold text-[hsl(222,62%,28%)]">McSpencer</span>
              <span className="text-[10px] font-semibold text-[hsl(86,72%,40%)] uppercase tracking-wide">Enterprise</span>
            </div>
          </a>

          {/* Nav links — hidden on mobile */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-foreground/80">
            <a
              href="/shop"
              onClick={(e) => { e.preventDefault(); setLocation("/shop"); }}
              className="hover:text-[hsl(86,72%,40%)] transition-colors"
              data-testid="link-nav-shop"
            >
              Shop
            </a>
            <a href="#categories" onClick={(e) => { e.preventDefault(); scrollTo("categories"); }}
              className="hover:text-[hsl(86,72%,40%)] transition-colors" data-testid="link-nav-store">
              Categories
            </a>
            <a
              href="/wishlist"
              onClick={(e) => { e.preventDefault(); setLocation("/wishlist"); }}
              className="hover:text-[hsl(86,72%,40%)] transition-colors relative"
              data-testid="link-nav-wishlist"
            >
              Wishlist
              {wishCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishCount > 9 ? "9+" : wishCount}
                </span>
              )}
            </a>
            <a
              href="/compare"
              onClick={(e) => { e.preventDefault(); setLocation("/compare"); }}
              className="hover:text-[hsl(86,72%,40%)] transition-colors relative"
              data-testid="link-nav-compare"
            >
              Compare
              {compareCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-[hsl(86,72%,45%)] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {compareCount}
                </span>
              )}
            </a>
            <a
              href="/support"
              onClick={(e) => { e.preventDefault(); setLocation("/support"); }}
              className="hover:text-[hsl(86,72%,40%)] transition-colors"
              data-testid="link-nav-support"
            >
              Support
            </a>
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-1">
            {/* Wishlist icon (mobile visible) */}
            <button
              onClick={() => setLocation("/wishlist")}
              className="relative p-2 hover:bg-red-50 rounded-full transition-colors group"
              data-testid="button-wishlist"
            >
              <Heart className={`w-5 h-5 transition-colors ${wishCount > 0 ? "fill-red-500 text-red-500" : "text-[hsl(222,62%,28%)] group-hover:text-red-400"}`} />
              {wishCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center translate-x-1/2 -translate-y-1/2">
                  {wishCount > 9 ? "9+" : wishCount}
                </span>
              )}
            </button>

            {/* Compare icon (mobile visible) */}
            <button
              onClick={() => setLocation("/compare")}
              className="relative p-2 hover:bg-[hsl(86,72%,45%)]/10 rounded-full transition-colors group"
              data-testid="button-compare"
            >
              <GitCompare className={`w-5 h-5 transition-colors ${compareCount > 0 ? "text-[hsl(86,72%,38%)]" : "text-[hsl(222,62%,28%)] group-hover:text-[hsl(86,72%,40%)]"}`} />
              {compareCount > 0 && (
                <span className="absolute top-1 right-1 bg-[hsl(86,72%,45%)] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center translate-x-1/2 -translate-y-1/2">
                  {compareCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={onCartClick}
              className="relative p-2 hover:bg-[hsl(222,62%,28%)]/10 rounded-full transition-colors group"
              data-testid="button-cart"
            >
              <ShoppingBag className="w-5 h-5 text-[hsl(222,62%,28%)] group-hover:text-[hsl(86,72%,40%)] transition-colors" />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 bg-[hsl(86,72%,45%)] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center translate-x-1/2 -translate-y-1/2" data-testid="badge-cart-count">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile bottom navigation ── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border shadow-[0_-2px_20px_rgba(27,52,114,0.10)]"
        data-testid="bottom-nav"
      >
        <div className="flex items-stretch h-16">
          <MobileNavItem icon={<Home className="w-5 h-5" />} label="Home" onClick={() => setLocation("/")} testId="bottom-nav-home" />
          <MobileNavItem icon={<Grid3X3 className="w-5 h-5" />} label="Shop" onClick={() => setLocation("/shop")} testId="bottom-nav-shop" />
          <MobileNavItem
            icon={
              <div className="relative">
                <Heart className={`w-5 h-5 ${wishCount > 0 ? "fill-red-500 text-red-500" : ""}`} />
                {wishCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">{wishCount}</span>}
              </div>
            }
            label="Wishlist"
            onClick={() => setLocation("/wishlist")}
            testId="bottom-nav-wishlist"
          />
          <MobileNavItem
            icon={
              <div className="relative">
                <GitCompare className={`w-5 h-5 ${compareCount > 0 ? "text-[hsl(86,72%,38%)]" : ""}`} />
                {compareCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-[hsl(86,72%,45%)] text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">{compareCount}</span>}
              </div>
            }
            label="Compare"
            onClick={() => setLocation("/compare")}
            testId="bottom-nav-compare"
          />
          <button
            onClick={onCartClick}
            className="relative flex-1 flex flex-col items-center justify-center gap-1 text-[hsl(222,62%,28%)] hover:text-[hsl(86,72%,40%)] transition-colors active:scale-95"
            data-testid="bottom-nav-cart"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[hsl(86,72%,45%)] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-semibold">Cart</span>
          </button>
        </div>
      </nav>
    </>
  );
}

function MobileNavItem({ icon, label, onClick, testId }: { icon: React.ReactNode; label: string; onClick: () => void; testId: string }) {
  return (
    <button
      onClick={onClick}
      className="flex-1 flex flex-col items-center justify-center gap-1 text-[hsl(222,62%,28%)] hover:text-[hsl(86,72%,40%)] transition-colors active:scale-95"
      data-testid={testId}
    >
      {icon}
      <span className="text-[10px] font-semibold">{label}</span>
    </button>
  );
}
