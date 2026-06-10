import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";

const PHRASES = [
  "Get Something Different",
  "Quality You Can Trust",
  "Delivered Across SA",
  "Six Categories. One Store.",
];

function useTypewriter(phrases: string[], typingSpeed = 60, erasingSpeed = 35, pause = 1800) {
  const [displayed, setDisplayed] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const current = phrases[phraseIdx];

    if (isTyping) {
      if (displayed.length < current.length) {
        timeout.current = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), typingSpeed);
      } else {
        timeout.current = setTimeout(() => setIsTyping(false), pause);
      }
    } else {
      if (displayed.length > 0) {
        timeout.current = setTimeout(() => setDisplayed(displayed.slice(0, -1)), erasingSpeed);
      } else {
        setPhraseIdx((i) => (i + 1) % phrases.length);
        setIsTyping(true);
      }
    }

    return () => { if (timeout.current) clearTimeout(timeout.current); };
  }, [displayed, isTyping, phraseIdx, phrases, typingSpeed, erasingSpeed, pause]);

  return { displayed, isTyping };
}

export function Hero() {
  const [, setLocation] = useLocation();
  const { displayed, isTyping } = useTypewriter(PHRASES);

  return (
    <section
      className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden"
      data-testid="section-hero"
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1920&h=1080&fit=crop"
          alt="Hero background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      </div>

      <div className="max-w-4xl mx-auto z-10 relative">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-sm font-semibold tracking-[0.2em] uppercase text-white/60 mb-6"
          data-testid="text-hero-eyebrow"
        >
          South Africa's Multi-Category Marketplace
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 text-white"
          data-testid="text-hero-title"
        >
          McSpencer Enterprise.
        </motion.h1>

        {/* Typing animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-xl md:text-3xl text-white/80 font-medium tracking-tight mb-12 max-w-2xl mx-auto min-h-[2.5rem] flex items-center justify-center"
          data-testid="text-hero-subtitle"
        >
          <span>{displayed}</span>
          <span
            className={`ml-0.5 inline-block w-[3px] h-[1em] bg-[hsl(86,72%,65%)] rounded-sm align-middle ${isTyping ? "animate-pulse" : "opacity-30"}`}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => setLocation("/shop")}
            className="inline-flex items-center justify-center px-8 py-4 text-sm font-semibold rounded-full bg-white text-[#1D1D1F] hover:bg-white/90 transition-colors"
            data-testid="link-hero-cta"
          >
            Shop the collection <span className="ml-2">→</span>
          </button>
          <a
            href="#categories"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center justify-center px-8 py-4 text-sm font-semibold rounded-full border border-white/40 text-white hover:bg-white/10 transition-colors"
            data-testid="link-hero-categories"
          >
            Browse categories
          </a>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
}
