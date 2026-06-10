import React, { useState } from "react";
import { useLocation } from "wouter";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Clock,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Truck,
  RefreshCw,
  CreditCard,
  Package,
  MessageSquare,
} from "lucide-react";

const logoImg = "/logo.jpg";

const faqs = [
  {
    q: "How long does delivery take in South Africa?",
    a: "Standard delivery takes 3–5 business days to major centres (Johannesburg, Cape Town, Durban, Pretoria). Remote areas may take 5–8 business days. We use The Courier Guy and Courier It for reliable nationwide coverage.",
  },
  {
    q: "What is your free shipping threshold?",
    a: "All orders over R 5 000 qualify for free standard shipping anywhere in South Africa. Orders below R 5 000 attract a flat R 150 delivery fee.",
  },
  {
    q: "Can I return a product?",
    a: "Yes. We offer a 14-day hassle-free return policy. Products must be in their original packaging and unused condition. Simply contact us at support@mcspencer.co.za to initiate a return — we'll arrange a collection at no extra cost.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit and debit cards (Visa, Mastercard), EFT bank transfer, and instant EFT via Ozow. All transactions are secured with 256-bit SSL encryption.",
  },
  {
    q: "Do you offer a warranty on electronics?",
    a: "All electronics carry a minimum 12-month manufacturer's warranty. Extended warranties of 24 or 36 months are available for select products at checkout. Warranty claims are processed within 5 business days.",
  },
  {
    q: "How do I track my order?",
    a: "Once your order is dispatched, you'll receive an SMS and email with a tracking number. You can use it on the courier's website or call our support line and we'll track it for you.",
  },
  {
    q: "Are your car spares compatible with my vehicle?",
    a: "Each car spare listing includes a compatibility table with popular South African models. If you're unsure, send us your vehicle's year, make and model to support@mcspencer.co.za and we'll confirm before you order.",
  },
  {
    q: "Do you ship to SADC countries?",
    a: "Yes — we ship to Botswana, Namibia, Zimbabwe, Zambia, Mozambique, Lesotho and Eswatini. Cross-border shipping is quoted at checkout and typically takes 7–14 business days. Import duties are the buyer's responsibility.",
  },
];

const topics = [
  { icon: <Truck className="w-6 h-6" />, title: "Shipping & Delivery", desc: "Track orders, delivery times, and courier info." },
  { icon: <RefreshCw className="w-6 h-6" />, title: "Returns & Refunds", desc: "14-day return policy, refund processing timelines." },
  { icon: <ShieldCheck className="w-6 h-6" />, title: "Warranty Claims", desc: "Log a product fault or request a warranty repair." },
  { icon: <CreditCard className="w-6 h-6" />, title: "Payments & Billing", desc: "Card issues, EFT confirmation, invoices." },
  { icon: <Package className="w-6 h-6" />, title: "Order Issues", desc: "Wrong item, missing parcel, or damaged goods." },
  { icon: <MessageSquare className="w-6 h-6" />, title: "General Enquiries", desc: "Product compatibility, stock availability, bulk orders." },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 py-4 text-left text-sm font-semibold text-[hsl(222,62%,28%)] hover:text-[hsl(86,72%,38%)] transition-colors"
      >
        <span>{q}</span>
        {open ? <ChevronUp className="w-4 h-4 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 flex-shrink-0" />}
      </button>
      {open && (
        <p className="pb-4 text-sm text-muted-foreground leading-relaxed">{a}</p>
      )}
    </div>
  );
}

export function Support() {
  const [, setLocation] = useLocation();
  const [form, setForm] = useState({ name: "", email: "", order: "", message: "" });
  const [sent, setSent] = useState(false);

  const set = (f: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-[hsl(222,62%,28%)] pt-20">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <img src={logoImg} alt="McSpencer Enterprise" className="h-12 w-12 rounded-full object-cover border-2 border-[hsl(86,72%,45%)]" />
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Support Centre</h1>
            <p className="text-white/60 text-sm mt-1">McSpencer Enterprise — we're here to help, every step of the way.</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 pb-28 md:pb-16">
        {/* Back */}
        <button
          onClick={() => setLocation("/")}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[hsl(222,62%,28%)] mb-10 group transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to shop
        </button>

        {/* Support topics */}
        <section className="mb-14">
          <h2 className="text-xl font-black text-[hsl(222,62%,28%)] mb-6">How can we help you?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {topics.map((t) => (
              <div
                key={t.title}
                className="bg-white border-2 border-border rounded-2xl p-5 flex flex-col gap-3 hover:border-[hsl(86,72%,45%)] hover:shadow-md transition-all cursor-default"
              >
                <span className="w-10 h-10 rounded-xl bg-[hsl(86,72%,45%)]/10 text-[hsl(86,72%,40%)] flex items-center justify-center">
                  {t.icon}
                </span>
                <div>
                  <p className="font-bold text-sm text-[hsl(222,62%,28%)]">{t.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
          {/* Left — FAQ + contact */}
          <div>
            {/* FAQ */}
            <section className="mb-12">
              <h2 className="text-xl font-black text-[hsl(222,62%,28%)] mb-4">Frequently Asked Questions</h2>
              <div className="bg-white border-2 border-border rounded-2xl px-6 divide-y divide-border">
                {faqs.map((f) => (
                  <FAQItem key={f.q} q={f.q} a={f.a} />
                ))}
              </div>
            </section>

            {/* Contact channels */}
            <section>
              <h2 className="text-xl font-black text-[hsl(222,62%,28%)] mb-4">Get in Touch</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white border-2 border-border rounded-2xl p-5 flex gap-4 items-start">
                  <span className="w-10 h-10 rounded-xl bg-[hsl(222,62%,28%)]/8 text-[hsl(222,62%,28%)] flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="font-bold text-sm text-[hsl(222,62%,28%)]">Email Support</p>
                    <p className="text-xs text-muted-foreground mt-0.5">support@mcspencer.co.za</p>
                    <p className="text-[11px] text-[hsl(86,72%,38%)] font-semibold mt-1">Response within 24 hours</p>
                  </div>
                </div>
                <div className="bg-white border-2 border-border rounded-2xl p-5 flex gap-4 items-start">
                  <span className="w-10 h-10 rounded-xl bg-[hsl(222,62%,28%)]/8 text-[hsl(222,62%,28%)] flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="font-bold text-sm text-[hsl(222,62%,28%)]">Phone Support</p>
                    <p className="text-xs text-muted-foreground mt-0.5">+27 78 048 1387</p>
                    <p className="text-[11px] text-[hsl(86,72%,38%)] font-semibold mt-1">Mon–Fri, 08:00–17:00 SAST</p>
                  </div>
                </div>
                <div className="bg-white border-2 border-border rounded-2xl p-5 flex gap-4 items-start">
                  <span className="w-10 h-10 rounded-xl bg-[hsl(222,62%,28%)]/8 text-[hsl(222,62%,28%)] flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="font-bold text-sm text-[hsl(222,62%,28%)]">Business Hours</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Monday – Friday: 08:00 – 17:00</p>
                    <p className="text-xs text-muted-foreground">Saturday: 09:00 – 13:00</p>
                    <p className="text-xs text-muted-foreground">Sunday & Public Holidays: Closed</p>
                  </div>
                </div>
                <div className="bg-white border-2 border-border rounded-2xl p-5 flex gap-4 items-start">
                  <span className="w-10 h-10 rounded-xl bg-[hsl(222,62%,28%)]/8 text-[hsl(222,62%,28%)] flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="font-bold text-sm text-[hsl(222,62%,28%)]">Head Office</p>
                    <p className="text-xs text-muted-foreground mt-0.5">McSpencer Enterprise (Pty) Ltd</p>
                    <p className="text-xs text-muted-foreground">208 Jeppe Street, Marble Towers</p>
                    <p className="text-xs text-muted-foreground">Johannesburg, 2001</p>
                    <p className="text-xs text-muted-foreground">South Africa</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right — Contact form */}
          <div>
            <div className="bg-white border-2 border-border rounded-2xl overflow-hidden sticky top-24">
              <div className="bg-[hsl(222,62%,28%)] px-6 py-4">
                <h2 className="text-base font-black text-white">Send Us a Message</h2>
                <p className="text-white/60 text-xs mt-0.5">We'll respond within one business day.</p>
              </div>
              {sent ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-[hsl(86,72%,45%)]/15 border-4 border-[hsl(86,72%,45%)] flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="w-8 h-8 text-[hsl(86,72%,45%)]" />
                  </div>
                  <p className="font-black text-[hsl(222,62%,28%)] mb-1">Message Received!</p>
                  <p className="text-sm text-muted-foreground">Our team will be in touch within 24 hours.</p>
                  <button
                    onClick={() => setSent(false)}
                    className="mt-5 text-xs text-[hsl(86,72%,38%)] hover:underline font-semibold"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5">Full Name</label>
                    <input
                      required
                      value={form.name}
                      onChange={set("name")}
                      placeholder="Thabo Nkosi"
                      className="w-full border-2 border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:border-[hsl(222,62%,28%)] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5">Email Address</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={set("email")}
                      placeholder="you@example.co.za"
                      className="w-full border-2 border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:border-[hsl(222,62%,28%)] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5">Order Number <span className="text-muted-foreground/50 normal-case font-normal">(optional)</span></label>
                    <input
                      value={form.order}
                      onChange={set("order")}
                      placeholder="MCE-2024-XXXXX"
                      className="w-full border-2 border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:border-[hsl(222,62%,28%)] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5">Message</label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={set("message") as any}
                      placeholder="Describe your issue or question..."
                      className="w-full border-2 border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:border-[hsl(222,62%,28%)] transition-colors resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full btn-primary font-black text-sm shadow"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
