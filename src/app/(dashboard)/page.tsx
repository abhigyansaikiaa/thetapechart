"use client";

import { useState, useEffect } from "react";
import { Brain, RefreshCw, Zap, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { motion } from "framer-motion";
import useSWR from "swr";

// Components
import { TickerBar } from "@/components/trading/TickerBar";
import { IndexCard } from "@/components/trading/IndexCard";
import { TradeSuggestionCard } from "@/components/trading/TradeSuggestionCard";
import { SectorHeatmap } from "@/components/trading/SectorHeatmap";
import { FearGreedGauge } from "@/components/trading/FearGreedGauge";
import { FiiDiiFlow } from "@/components/trading/FiiDiiFlow";
import { EventsTimeline } from "@/components/trading/EventsTimeline";


import {
  INDEX_SYMBOLS,
  STATIC_SECTORS,
  FEAR_GREED_VALUE,
  getFearColor,
  getFearLabel,
  FII_DII,
  EVENTS,
  TradeSuggestionResponse
} from "@/lib/dashboardData";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Dashboard() {
  const [time, setTime] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [suggestions, setSuggestions] = useState<TradeSuggestionResponse>({
    market_bias: "Neutral",
    market_summary: "Loading AI analysis...",
    suggestions: []
  });
  const [loading, setLoading] = useState(false);

  const [showWelcome, setShowWelcome] = useState(true);

  // Live Market Data
  const symbolList = INDEX_SYMBOLS.map(s => s.symbol).join(",");
  const { data: nseIndices, isLoading: indicesLoading } = useSWR(`/api/market/quotes?symbols=${symbolList}`, fetcher, { refreshInterval: 60000 });
  const { data: nseGainers, isLoading: gainersLoading } = useSWR('/api/market/nse-gainers', fetcher, { refreshInterval: 60000 });

  const liveDataRecord = Array.isArray(nseIndices) 
    ? nseIndices.reduce((acc, item) => ({ ...acc, [item.symbol]: item }), {})
    : {};
    
  const gainers = nseGainers?.gainers || [];
  const losers = nseGainers?.losers || [];

  // Live IST Clock
  useEffect(() => {
    const updateTime = () => {
      setTime(
        new Date().toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour12: false,
        })
      );
    };
    updateTime();
    const id = setInterval(updateTime, 1000);
    return () => clearInterval(id);
  }, []);

  // Fetch AI Trade Suggestions
  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/trade-suggestions");
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data);
      }
    } catch (err) {
      console.error("Failed to fetch trade suggestions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchSuggestions();
    setIsRefreshing(false);
  };

  return (
    <PageWrapper className="pb-8">
      {/* Top Ticker Marquee */}
      <div className="-mx-4 md:-mx-6 lg:-mx-8 -mt-6 mb-6 relative z-10">
        <TickerBar items={INDEX_SYMBOLS} liveData={liveDataRecord} />
      </div>

      <div className="flex flex-col gap-6">

        {/* Welcome Banner */}
        {showWelcome && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-accent/20 via-purple-500/10 to-blue-500/10 border border-accent/20 p-6 shadow-[0_0_40px_rgba(139,92,246,0.1)]"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-2 flex items-center gap-2">
                  <Brain className="text-accent" /> Welcome to Alphaedge Terminal
                </h2>
                <p className="text-foreground-secondary text-[14px] max-w-2xl leading-relaxed">
                  You are viewing an institutional-grade quant trading interface. Monitor live global markets (India, US, Crypto, Forex), analyze real-time flow, and leverage our AI agent for high-probability trade setups and technical analysis. Tap any symbol to open advanced TradingView charts.
                </p>
              </div>
              <button 
                onClick={() => setShowWelcome(false)}
                className="shrink-0 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors border border-white/10"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              Market Overview
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-positive opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-positive"></span>
              </div>
            </h1>
            <p className="text-[13px] text-foreground-secondary mt-1 font-medium">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} ·{" "}
              <span className="font-numeric text-accent font-semibold">{time} IST</span>
              <span className="ml-2 text-foreground-muted">
                {loading ? "· Fetching AI suggestions..." : "· Dynamic AI Suggestions Live"}
              </span>
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link
              href="/analyze"
              className="flex items-center gap-2 bg-gradient-to-r from-accent to-purple-600 hover:from-accent-hover hover:to-purple-700 text-white px-4 py-2 rounded-lg text-[13px] font-bold shadow-[0_4px_14px_rgba(139,92,246,0.3)] transition-all hover:scale-105 active:scale-95"
            >
              <Brain size={16} className="animate-pulse" /> AI Analyze
            </Link>
            
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 bg-surface border border-border/80 hover:bg-surface-hover text-foreground-secondary px-3 py-2 rounded-lg text-[13px] transition-colors"
            >
              <RefreshCw size={16} className={isRefreshing ? "animate-spin text-white" : ""} /> 
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Live Indices Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {INDEX_SYMBOLS.map((sym, i) => (
            <IndexCard
              key={sym.symbol}
              sym={sym}
              data={liveDataRecord[sym.symbol]}
              delay={i * 0.05}
            />
          ))}
        </div>

        {/* Main 2-Column Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN - AI Trade Suggestions */}
          <div className="lg:col-span-2 space-y-4">
            
            <div className="flex justify-between items-end mb-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center shadow-lg shadow-accent/20">
                  <Zap size={16} color="#fff" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    AI Trade Suggestions
                    {suggestions.market_bias && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          suggestions.market_bias === "Bullish"
                            ? "bg-positive/10 text-positive"
                            : suggestions.market_bias === "Bearish"
                            ? "bg-negative/10 text-negative"
                            : "bg-foreground-muted/10 text-foreground-muted"
                        }`}
                      >
                        {suggestions.market_bias} BIAS
                      </span>
                    )}
                  </h2>
                  <span className="text-[11px] text-foreground-muted font-medium">
                    AI-generated · Not financial advice
                  </span>
                </div>
              </div>
            </div>

            {/* AI Market Summary */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-accent/5 border border-accent/15 rounded-xl p-4 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <p className="text-[13px] text-foreground-secondary leading-relaxed m-0 relative z-10">
                {suggestions.market_summary}
              </p>
            </motion.div>

            {/* Suggestions List */}
            <div className="space-y-3">
              {suggestions.suggestions.map((s, i) => (
                <TradeSuggestionCard key={s.id} suggestion={s} index={i} />
              ))}
            </div>

            {/* Avoid Section */}
            {suggestions.avoid && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex gap-3 p-4 rounded-xl bg-negative/5 border border-negative/15 mt-2"
              >
                <AlertTriangle size={18} className="text-negative flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] text-negative font-bold mb-1 tracking-widest uppercase">
                    Avoid Today
                  </div>
                  <div className="text-[13px] text-foreground-secondary leading-relaxed">
                    {suggestions.avoid}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* RIGHT COLUMN - Market Context */}
          <div className="space-y-4">
            <SectorHeatmap sectors={STATIC_SECTORS} />
            <FiiDiiFlow data={FII_DII} />
            
            {/* Fear & Greed + Events Combined Card */}
            <div className="card p-4 rounded-xl flex flex-col gap-4">
              <FearGreedGauge 
                value={FEAR_GREED_VALUE} 
                color={getFearColor(FEAR_GREED_VALUE)} 
                label={getFearLabel(FEAR_GREED_VALUE)} 
              />
              <div className="h-px w-full bg-border/50" />
              <EventsTimeline events={EVENTS} />
            </div>
          </div>
        </div>

        {/* BOTTOM GRID - Gainers, Losers, Quick Access */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
          
          {/* Top Gainers */}
          <div className="card p-4 rounded-xl flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-semibold text-white tracking-wide">Top Gainers</h2>
              <div className="p-1 bg-positive/10 rounded">
                <TrendingUp size={14} className="text-positive" />
              </div>
            </div>
            <div className="space-y-1">
              {gainersLoading ? (
                <div className="text-[12px] text-foreground-muted p-2">Loading gainers...</div>
              ) : gainers.length === 0 ? (
                <div className="text-[12px] text-foreground-muted p-2">No data available</div>
              ) : (
                gainers.map((s: any) => (
                  <Link href={`/chart?symbol=${s.symbol}`} key={s.symbol} className="flex justify-between items-center py-1.5 border-b border-border/30 last:border-0 hover:bg-surface-hover/30 rounded px-1 -mx-1 transition-colors">
                    <div>
                      <div className="text-[12px] font-bold text-foreground truncate max-w-[80px] sm:max-w-[120px]" title={s.symbol}>{s.symbol}</div>
                      <div className="text-[10px] text-foreground-muted font-numeric">₹{s.price.toFixed(2)}</div>
                    </div>
                    <div className="text-[11px] font-bold text-positive font-numeric bg-positive/10 px-1.5 py-0.5 rounded">
                      +{s.changePercent.toFixed(2)}%
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Top Losers */}
          <div className="card p-4 rounded-xl flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-semibold text-white tracking-wide">Top Losers</h2>
              <div className="p-1 bg-negative/10 rounded">
                <TrendingDown size={14} className="text-negative" />
              </div>
            </div>
            <div className="space-y-1">
              {gainersLoading ? (
                <div className="text-[12px] text-foreground-muted p-2">Loading losers...</div>
              ) : losers.length === 0 ? (
                <div className="text-[12px] text-foreground-muted p-2">No data available</div>
              ) : (
                losers.map((s: any) => (
                  <Link href={`/chart?symbol=${s.symbol}`} key={s.symbol} className="flex justify-between items-center py-1.5 border-b border-border/30 last:border-0 hover:bg-surface-hover/30 rounded px-1 -mx-1 transition-colors">
                    <div>
                      <div className="text-[12px] font-bold text-foreground truncate max-w-[80px] sm:max-w-[120px]" title={s.symbol}>{s.symbol}</div>
                      <div className="text-[10px] text-foreground-muted font-numeric">₹{s.price.toFixed(2)}</div>
                    </div>
                    <div className="text-[11px] font-bold text-negative font-numeric bg-negative/10 px-1.5 py-0.5 rounded">
                      {s.changePercent.toFixed(2)}%
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </PageWrapper>
  );
}
