import React from "react";
import { useLocation } from "wouter";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import { CartItem } from "../hooks/useCart";
import { formatZAR } from "../lib/currency";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  updateQuantity: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  total: number;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  updateQuantity,
  removeItem,
  total,
}: CartDrawerProps) {
  const [, setLocation] = useLocation();

  const handleCheckout = () => {
    onClose();
    setLocation("/checkout");
  };

  const freeShippingThreshold = 5000;
  const shipping = total >= freeShippingThreshold ? 0 : 150;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/25 backdrop-blur-sm z-50"
          onClick={onClose}
          data-testid="overlay-cart"
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-background shadow-2xl z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        data-testid="drawer-cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-[hsl(222,62%,28%)]">
          <div>
            <h2 className="text-lg font-black tracking-tight text-white" data-testid="text-cart-title">Your Bag</h2>
            <p className="text-[hsl(86,72%,65%)] text-xs font-medium">
              {items.length === 0 ? "Empty" : `${items.reduce((s, i) => s + i.quantity, 0)} item${items.reduce((s, i) => s + i.quantity, 0) !== 1 ? "s" : ""}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
            data-testid="button-close-cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
              <div className="w-20 h-20 bg-[hsl(222,62%,28%)]/8 rounded-full flex items-center justify-center">
                <svg className="w-9 h-9 text-[hsl(222,62%,28%)]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-lg font-bold text-[hsl(222,62%,28%)]">Your bag is empty</p>
              <p className="text-sm text-muted-foreground">Free delivery on orders over {formatZAR(freeShippingThreshold)}</p>
              <button
                onClick={onClose}
                className="mt-4 px-7 py-2.5 btn-primary rounded-full text-sm font-bold"
                data-testid="button-continue-shopping-empty"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 group" data-testid={`cart-item-${item.id}`}>
                <div className="w-20 h-20 bg-muted rounded-xl overflow-hidden flex-shrink-0 border border-border/50">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 flex flex-col min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-[hsl(222,62%,28%)] line-clamp-2 leading-snug" data-testid={`cart-text-name-${item.id}`}>
                        {item.name}
                      </p>
                      <p className="text-[11px] text-[hsl(86,72%,38%)] font-semibold mt-0.5">{item.category}</p>
                    </div>
                    <span className="font-black text-sm text-[hsl(222,62%,28%)] flex-shrink-0" data-testid={`cart-text-price-${item.id}`}>
                      {formatZAR(item.price * item.quantity)}
                    </span>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="flex items-center border-2 border-[hsl(222,62%,28%)]/15 rounded-full overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 hover:bg-[hsl(222,62%,28%)]/8 transition-colors text-[hsl(222,62%,28%)]"
                        data-testid={`cart-button-dec-${item.id}`}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-black text-[hsl(222,62%,28%)]" data-testid={`cart-text-qty-${item.id}`}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 hover:bg-[hsl(222,62%,28%)]/8 transition-colors text-[hsl(222,62%,28%)]"
                        data-testid={`cart-button-inc-${item.id}`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground hover:text-destructive p-2 transition-colors"
                      data-testid={`cart-button-remove-${item.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border p-5 bg-background">
            {/* Free shipping bar */}
            {total < freeShippingThreshold && (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                  <span>Free shipping progress</span>
                  <span>{formatZAR(freeShippingThreshold - total)} away</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[hsl(86,72%,45%)] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((total / freeShippingThreshold) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mb-1 text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-bold text-[hsl(222,62%,28%)]">{formatZAR(total)}</span>
            </div>
            <div className="flex justify-between items-center mb-4 text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className={`font-bold ${shipping === 0 ? "text-[hsl(86,72%,38%)]" : "text-[hsl(222,62%,28%)]"}`}>
                {shipping === 0 ? "Free" : formatZAR(shipping)}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-4 rounded-full btn-primary font-black text-base shadow-lg"
              data-testid="button-checkout"
            >
              Checkout — {formatZAR(total + shipping)}
            </button>
            <p className="text-xs text-center text-muted-foreground mt-3">
              Secure checkout. Taxes calculated at payment.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
