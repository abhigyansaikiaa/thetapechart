"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { motion } from "framer-motion";
import { LineChart, BarChart2, Activity } from "lucide-react";

let tvScriptLoadingPromise: Promise<void> | null = null;

export default function ChartPage() {
  const searchParams = useSearchParams();
  const symbolParam = searchParams.get("symbol") || "BINANCE:BTCUSDT";

  // TradingView sometimes requires specific exchange prefixes for best results
  // We clean up symbols from Yahoo Finance (e.g. ^NSEI -> NSE:NIFTY)
  const formatSymbolForTV = (sym: string) => {
    if (sym === "^NSEI" || sym === "NIFTY 50") return "NSE:NIFTY";
    if (sym === "^NSEBANK" || sym === "NIFTY BANK") return "NSE:BANKNIFTY";
    if (sym === "FINNIFTY") return "NSE:FINNIFTY";
    if (sym.endsWith(".NS")) return `NSE:${sym.replace(".NS", "")}`;
    if (sym.endsWith(".BO")) return `BSE:${sym.replace(".BO", "")}`;
    return sym; // Default fallback (AAPL, BINANCE:BTCUSDT, etc.)
  };

  const tvSymbol = formatSymbolForTV(symbolParam);
  const containerId = "tv_chart_container";
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Dynamically inject the TradingView Advanced Widget Script
    const loadScript = () => {
      if (!tvScriptLoadingPromise) {
        tvScriptLoadingPromise = new Promise((resolve) => {
          const script = document.createElement("script");
          script.id = "tradingview-widget-loading-script";
          script.src = "https://s3.tradingview.com/tv.js";
          script.type = "text/javascript";
          script.onload = () => resolve();
          document.head.appendChild(script);
        });
      }
      return tvScriptLoadingPromise;
    };

    loadScript().then(() => {
      if (typeof window !== "undefined" && (window as any).TradingView) {
        new (window as any).TradingView.widget({
          autosize: true,
          symbol: tvSymbol,
          interval: "D",
          timezone: "Asia/Kolkata",
          theme: "dark",
          style: "1",
          locale: "en",
          enable_publishing: false,
          backgroundColor: "#0B0B0F", // match our app background
          gridColor: "#1F1F2E",
          hide_top_toolbar: false,
          hide_legend: false,
          save_image: false,
          container_id: containerId,
        });
        setIsLoaded(true);
      }
    });

  }, [tvSymbol]);

  return (
    <PageWrapper className="pb-8 h-[calc(100vh-6rem)]">
      <div className="flex flex-col h-full gap-4">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              Advanced Charts
              <span className="px-2.5 py-1 rounded bg-accent/10 text-accent text-sm font-bold tracking-wider font-numeric border border-accent/20">
                {tvSymbol}
              </span>
            </h1>
            <p className="text-[13px] text-foreground-secondary mt-1 font-medium">
              Institutional-grade technical analysis powered by TradingView.
            </p>
          </div>
          
          <div className="flex gap-2">
            <div className="px-3 py-1.5 rounded bg-surface border border-border/50 text-[12px] font-semibold text-foreground-muted flex items-center gap-2">
              <LineChart size={14} /> Indicators
            </div>
            <div className="px-3 py-1.5 rounded bg-surface border border-border/50 text-[12px] font-semibold text-foreground-muted flex items-center gap-2">
              <BarChart2 size={14} /> Volume Profile
            </div>
            <div className="px-3 py-1.5 rounded bg-surface border border-border/50 text-[12px] font-semibold text-foreground-muted flex items-center gap-2">
              <Activity size={14} /> Pine Script
            </div>
          </div>
        </div>

        {/* Chart Container */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-grow w-full rounded-xl border border-border/50 overflow-hidden relative bg-surface shadow-2xl"
        >
          {!isLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background z-10">
              <div className="relative flex h-12 w-12 mb-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-30"></span>
                <span className="relative inline-flex rounded-full h-12 w-12 bg-accent/20 flex items-center justify-center">
                  <LineChart className="text-accent animate-pulse" size={20} />
                </span>
              </div>
              <p className="text-foreground-muted text-sm font-medium animate-pulse">Initializing TradingView Engine...</p>
            </div>
          )}
          
          {/* TradingView Widget attaches here */}
          <div id={containerId} className="w-full h-full absolute inset-0" />
        </motion.div>
        
      </div>
    </PageWrapper>
  );
}
