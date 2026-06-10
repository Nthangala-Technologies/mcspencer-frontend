import React from "react";
import { useLocation } from "wouter";

export function Footer() {
  const [, setLocation] = useLocation();
  return (
    <footer className="bg-[hsl(222,62%,28%)] text-white/60 py-10 px-6 mb-16 md:mb-0" data-testid="footer">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
        {/* Brand */}
        <div>
          <p className="text-white font-black text-lg mb-1">McSpencer Enterprise</p>
          <p className="text-white/50 text-xs leading-relaxed">
            South Africa's trusted multi-category marketplace. Electronics, Hardware, Car Spares, Stationery, Fashion and AgroMarket — all under one roof.
          </p>
        </div>
        {/* Quick links */}
        <div>
          <p className="text-white font-bold text-sm mb-3 uppercase tracking-wide">Quick Links</p>
          <ul className="space-y-2 text-xs">
            <li><a href="/" onClick={(e) => { e.preventDefault(); setLocation("/"); }} className="hover:text-[hsl(86,72%,55%)] transition-colors">Home</a></li>
            <li><a href="/shop" onClick={(e) => { e.preventDefault(); setLocation("/shop"); }} className="hover:text-[hsl(86,72%,55%)] transition-colors">Shop</a></li>
            <li><a href="/wishlist" onClick={(e) => { e.preventDefault(); setLocation("/wishlist"); }} className="hover:text-[hsl(86,72%,55%)] transition-colors">Wishlist</a></li>
            <li><a href="/compare" onClick={(e) => { e.preventDefault(); setLocation("/compare"); }} className="hover:text-[hsl(86,72%,55%)] transition-colors">Compare</a></li>
            <li><a href="/support" onClick={(e) => { e.preventDefault(); setLocation("/support"); }} className="hover:text-[hsl(86,72%,55%)] transition-colors">Support</a></li>
          </ul>
        </div>
        {/* Contact */}
        <div>
          <p className="text-white font-bold text-sm mb-3 uppercase tracking-wide">Contact</p>
          <ul className="space-y-1 text-xs text-white/50">
            <li>📧 support@mcspencer.co.za</li>
            <li>📞 +27 78 048 1387</li>
            <li>📍 208 Jeppe Street, Marble Towers</li>
            <li className="pl-5">Johannesburg, 2001</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        <span className="text-white/40 text-[10px]">— Get Something Different</span>
        <p className="text-white/40" data-testid="text-copyright">
          &copy; {new Date().getFullYear()} McSpencer Enterprise. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
