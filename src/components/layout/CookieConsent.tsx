"use client";

import { useState, useEffect } from "react";
import { Cookie, X } from "lucide-react";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already consented
    const hasConsented = localStorage.getItem("cookie_consent_accepted");
    if (!hasConsented) {
      // Small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie_consent_accepted", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 flex justify-center animate-in slide-in-from-bottom-8 duration-700">
      <div className="bg-[#111113]/90 backdrop-blur-xl border border-border rounded-2xl p-5 md:p-6 shadow-2xl max-w-4xl w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative">
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 text-foreground-muted hover:text-white transition-colors"
        >
          <X size={16} />
        </button>

        <div className="flex gap-4 items-start md:items-center">
          <div className="bg-accent/10 p-3 rounded-full text-accent shrink-0">
            <Cookie size={24} />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-1">Strict Device Limitations & Privacy</h3>
            <p className="text-foreground-secondary text-sm leading-relaxed max-w-2xl">
              To prevent abuse of our premium API tiers, Alphaedge uses secure device-fingerprinting cookies. We strictly limit chart analysis tools to <strong>2 requests per day per device</strong> to maintain high availability. By using our platform, you consent to these necessary security cookies.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 w-full md:w-auto">
          <button 
            onClick={acceptCookies}
            className="w-full md:w-auto bg-white text-black hover:bg-white/90 font-bold px-8 py-3 rounded-xl transition-colors whitespace-nowrap"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
