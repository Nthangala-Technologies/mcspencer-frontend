import React, { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Lock, Check } from "lucide-react";
import { CartItem } from "../hooks/useCart";
import { formatZAR } from "../lib/currency";
const logoImg = "/logo.jpg";

interface CheckoutProps {
  items: CartItem[];
  total: number;
  onOrderComplete: () => void;
}

type Step = "contact" | "shipping" | "payment";

export function Checkout({ items, total, onOrderComplete }: CheckoutProps) {
  const [, setLocation] = useLocation();
  const [activeStep, setActiveStep] = useState<Step>("contact");
  const [ordered, setOrdered] = useState(false);

  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "South Africa",
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardName: "",
  });

  const freeShippingThreshold = 5000;
  const shipping = total >= freeShippingThreshold ? 0 : 150;
  const orderTotal = total + shipping;

  const set = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [field]: e.target.value }));

  const formatCard = (v: string) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const formatExpiry = (v: string) =>
    v.replace(/\D/g, "").slice(0, 4).replace(/^(\d{2})(\d)/, "$1/$2");

  const steps: { key: Step; label: string }[] = [
    { key: "contact", label: "Contact" },
    { key: "shipping", label: "Shipping" },
    { key: "payment", label: "Payment" },
  ];

  const stepIndex = steps.findIndex((s) => s.key === activeStep);

  if (ordered) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6 pb-24">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 rounded-full bg-[hsl(86,72%,45%)]/15 flex items-center justify-center mx-auto mb-6 border-4 border-[hsl(86,72%,45%)]">
            <Check className="w-12 h-12 text-[hsl(86,72%,45%)]" />
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-3 text-[hsl(222,62%,28%)]">Order Confirmed!</h1>
          <p className="text-muted-foreground text-base mb-1">Thank you for shopping with McSpencer Enterprise.</p>
          <p className="text-muted-foreground text-sm mb-10">
            A confirmation will be sent to <strong>{form.email || "your email"}</strong>.
          </p>
          <button
            onClick={() => { onOrderComplete(); setLocation("/"); }}
            className="px-10 py-4 rounded-full btn-primary font-black text-base shadow-lg"
            data-testid="button-continue-shopping"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40 pt-20 pb-28 md:pb-24" data-testid="page-checkout">
      {/* Checkout header */}
      <div className="bg-[hsl(222,62%,28%)] sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); setLocation("/"); }}
            className="flex items-center gap-2"
          >
            <img src={logoImg} alt="McSpencer Enterprise" className="h-8 w-8 rounded-full object-cover border border-[hsl(86,72%,45%)]" />
            <span className="font-black text-white text-sm">McSpencer Enterprise</span>
          </a>
          <div className="flex items-center gap-2 text-xs text-white/60">
            <Lock className="w-3.5 h-3.5" />
            Secure checkout
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <button
          onClick={() => setLocation("/")}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[hsl(222,62%,28%)] mb-8 group transition-colors font-medium"
          data-testid="button-back-checkout"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to bag
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10">
          {/* Form */}
          <div className="space-y-4">
            {/* Step progress */}
            <div className="flex items-center gap-2 mb-8">
              {steps.map((step, i) => (
                <React.Fragment key={step.key}>
                  <button
                    onClick={() => i <= stepIndex && setActiveStep(step.key)}
                    className={`flex items-center gap-2 text-sm font-bold transition-colors ${
                      step.key === activeStep ? "text-[hsl(222,62%,28%)]" : i < stepIndex ? "text-muted-foreground hover:text-[hsl(222,62%,28%)]" : "text-muted-foreground/40"
                    }`}
                    data-testid={`button-step-${step.key}`}
                  >
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-colors ${
                      i < stepIndex ? "bg-[hsl(86,72%,45%)] text-white" : step.key === activeStep ? "bg-[hsl(222,62%,28%)] text-white" : "bg-muted text-muted-foreground"
                    }`}>
                      {i < stepIndex ? <Check className="w-3.5 h-3.5" /> : i + 1}
                    </span>
                    <span className="hidden sm:inline">{step.label}</span>
                  </button>
                  {i < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 rounded-full transition-colors ${i < stepIndex ? "bg-[hsl(86,72%,45%)]" : "bg-border"}`} />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Contact */}
            <Section title="Contact information" isActive={activeStep === "contact"} isDone={stepIndex > 0} onEdit={() => setActiveStep("contact")}>
              <FormField label="Email address" value={form.email} onChange={set("email")} placeholder="you@example.com" testId="input-email" type="email" />
              <button
                onClick={() => setActiveStep("shipping")}
                disabled={!form.email}
                className="mt-2 w-full py-3.5 rounded-full btn-primary font-black text-sm disabled:opacity-40 shadow"
                data-testid="button-contact-next"
              >
                Continue to shipping
              </button>
            </Section>

            {/* Shipping */}
            <Section title="Shipping address" isActive={activeStep === "shipping"} isDone={stepIndex > 1} onEdit={() => setActiveStep("shipping")}>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="First name" value={form.firstName} onChange={set("firstName")} placeholder="John" testId="input-first-name" />
                <FormField label="Last name" value={form.lastName} onChange={set("lastName")} placeholder="Doe" testId="input-last-name" />
              </div>
              <FormField label="Street address" value={form.address} onChange={set("address")} placeholder="123 Main Street" testId="input-address" />
              <div className="grid grid-cols-2 gap-4">
                <FormField label="City" value={form.city} onChange={set("city")} placeholder="Cape Town" testId="input-city" />
                <FormField label="Postal code" value={form.postalCode} onChange={set("postalCode")} placeholder="8001" testId="input-postal" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5">Country</label>
                <select
                  value={form.country}
                  onChange={set("country")}
                  className="w-full border-2 border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:border-[hsl(222,62%,28%)] transition-colors font-medium"
                  data-testid="select-country"
                >
                  {["South Africa", "Botswana", "Namibia", "Zimbabwe", "Zambia", "Mozambique", "Kenya", "Uganda", "Tanzania", "Nigeria"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => setActiveStep("payment")}
                disabled={!form.firstName || !form.lastName || !form.address || !form.city || !form.postalCode}
                className="mt-2 w-full py-3.5 rounded-full btn-primary font-black text-sm disabled:opacity-40 shadow"
                data-testid="button-shipping-next"
              >
                Continue to payment
              </button>
            </Section>

            {/* Payment */}
            <Section title="Payment details" isActive={activeStep === "payment"} isDone={false} onEdit={undefined}>
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-[hsl(86,72%,45%)]/8 rounded-xl px-3 py-2">
                <Lock className="w-3.5 h-3.5 text-[hsl(86,72%,40%)]" />
                All transactions are secure and encrypted.
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5">Card number</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.cardNumber}
                  onChange={(e) => setForm((p) => ({ ...p, cardNumber: formatCard(e.target.value) }))}
                  placeholder="1234 5678 9012 3456"
                  className="w-full border-2 border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:border-[hsl(222,62%,28%)] transition-colors font-mono"
                  data-testid="input-card-number"
                />
              </div>
              <FormField label="Name on card" value={form.cardName} onChange={set("cardName")} placeholder="John Doe" testId="input-card-name" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.expiry}
                    onChange={(e) => setForm((p) => ({ ...p, expiry: formatExpiry(e.target.value) }))}
                    placeholder="MM/YY"
                    className="w-full border-2 border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:border-[hsl(222,62%,28%)] transition-colors font-mono"
                    data-testid="input-expiry"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5">CVV</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.cvv}
                    onChange={(e) => setForm((p) => ({ ...p, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
                    placeholder="•••"
                    className="w-full border-2 border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:border-[hsl(222,62%,28%)] transition-colors font-mono"
                    data-testid="input-cvv"
                  />
                </div>
              </div>
              <button
                onClick={() => setOrdered(true)}
                disabled={!form.cardNumber || !form.expiry || !form.cvv || !form.cardName}
                className="mt-4 w-full py-4 rounded-full btn-primary font-black text-base disabled:opacity-40 flex items-center justify-center gap-2 shadow-lg"
                data-testid="button-place-order"
              >
                <Lock className="w-4 h-4" />
                Place Order — {formatZAR(orderTotal)}
              </button>
            </Section>
          </div>

          {/* Order summary */}
          <div>
            <div className="bg-background border-2 border-border rounded-2xl overflow-hidden sticky top-28" data-testid="section-order-summary">
              <div className="bg-[hsl(222,62%,28%)] px-5 py-4">
                <h2 className="text-base font-black text-white">Order Summary</h2>
              </div>
              <div className="p-5 space-y-4 max-h-72 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3" data-testid={`summary-item-${item.id}`}>
                    <div className="relative flex-shrink-0">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted border border-border">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-[hsl(86,72%,45%)] text-white text-[9px] font-black rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[hsl(222,62%,28%)] truncate">{item.name}</p>
                      <p className="text-[11px] text-[hsl(86,72%,38%)] font-semibold">{item.category}</p>
                    </div>
                    <p className="text-sm font-black text-[hsl(222,62%,28%)] flex-shrink-0">{formatZAR(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-border p-5 space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-bold">{formatZAR(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className={`font-bold ${shipping === 0 ? "text-[hsl(86,72%,38%)]" : ""}`}>
                    {shipping === 0 ? "Free" : formatZAR(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black border-t border-border pt-3 text-[hsl(222,62%,28%)]">
                  <span>Total</span>
                  <span>{formatZAR(orderTotal)}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-[11px] text-[hsl(86,72%,38%)] font-semibold text-center">
                    Add {formatZAR(freeShippingThreshold - total)} for free shipping
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  isActive,
  isDone,
  onEdit,
  children,
}: {
  title: string;
  isActive: boolean;
  isDone: boolean;
  onEdit?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className={`bg-background border-2 rounded-2xl overflow-hidden transition-all ${isActive ? "border-[hsl(222,62%,28%)]/30 shadow-sm" : "border-border"}`}>
      <div className={`flex items-center justify-between px-5 py-4 ${isActive ? "border-b border-border" : ""}`}>
        <div className="flex items-center gap-3">
          {isDone && (
            <span className="w-5 h-5 rounded-full bg-[hsl(86,72%,45%)] flex items-center justify-center flex-shrink-0">
              <Check className="w-3 h-3 text-white" />
            </span>
          )}
          <h3 className={`font-black text-sm ${!isActive && !isDone ? "text-muted-foreground" : "text-[hsl(222,62%,28%)]"}`}>{title}</h3>
        </div>
        {isDone && onEdit && (
          <button onClick={onEdit} className="text-xs text-[hsl(86,72%,40%)] hover:underline font-semibold">
            Edit
          </button>
        )}
      </div>
      {isActive && <div className="p-5 space-y-4">{children}</div>}
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  testId,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  testId: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border-2 border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:border-[hsl(222,62%,28%)] transition-colors font-medium"
        data-testid={testId}
      />
    </div>
  );
}
