"use client";

import { useState, useEffect, useCallback } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { motion } from "framer-motion";
import { Search, TrendingUp, TrendingDown, Loader2, Monitor, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
import { MARKET_TABS, MarketTab, StockEntry, getDisplaySymbol } from "@/lib/api/stockUniverse";

interface QuoteData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
}

export default function TerminalPage() {
  const [activeTab, setActiveTab] = useState<MarketTab>("nse");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<StockEntry[]>([]);
  const [searching, setSearching] = useState(false);
  const [quotes, setQuotes] = useState<Record<string, QuoteData>>({});
  const [loadingQuotes, setLoadingQuotes] = useState(false);

  const activeMarket = MARKET_TABS.find((t) => t.id === activeTab)!;

  // Fetch quotes for active tab stocks
  const fetchQuotes = useCallback(async (stocks: StockEntry[]) => {
    if (stocks.length === 0) return;
    setLoadingQuotes(true);
    try {
      const symbols = stocks.map((s) => s.symbol).join(",");
      const res = await fetch(`/api/proxy/yahoo-quote?symbols=${encodeURIComponent(symbols)}`);
      const data = await res.json();
      const quoteMap: Record<string, QuoteData> = {};
      (data.quotes || []).forEach((q: QuoteData) => {
        quoteMap[q.symbol] = q;
      });
      setQuotes((prev) => ({ ...prev, ...quoteMap }));
    } catch (err) {
      console.error("Failed to fetch quotes:", err);
    } finally {
      setLoadingQuotes(false);
    }
  }, []);

  useEffect(() => {
    fetchQuotes(activeMarket.data);
  }, [activeTab]);

  // Real-time search with debounce
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/proxy/yahoo-search?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        setSearchResults(data.results || []);
        // Also fetch quotes for search results
        if (data.results?.length > 0) {
          const symbols = data.results.map((r: any) => r.symbol).join(",");
          const quoteRes = await fetch(`/api/proxy/yahoo-quote?symbols=${encodeURIComponent(symbols)}`);
          const quoteData = await quoteRes.json();
          const quoteMap: Record<string, QuoteData> = {};
          (quoteData.quotes || []).forEach((q: QuoteData) => {
            quoteMap[q.symbol] = q;
          });
          setQuotes((prev) => ({ ...prev, ...quoteMap }));
        }
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const displayStocks = searchQuery.length >= 2 ? searchResults : activeMarket.data;

  const formatNumber = (n: number) => {
    if (!n) return "-";
    if (n >= 1e12) return `${(n / 1e12).toFixed(1)}T`;
    if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
    if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
    if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
    return n.toFixed(2);
  };

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6 max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4"
        >
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-accent to-purple-600 rounded-xl shadow-lg shadow-accent/20">
                <Monitor className="text-white" size={26} />
              </div>
              Stock Terminal
            </h1>
            <p className="text-foreground-secondary text-sm max-w-2xl">
              Explore 60,000+ global assets. Tap any stock for full TradingView charts, AI analysis, and institutional-grade trade setups.
            </p>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative"
        >
          <div className="relative">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search any stock, crypto, forex, index... (e.g. AAPL, RELIANCE, BTCUSDT)"
              className="w-full pl-12 pr-4 py-3.5 bg-surface-elevated border border-border rounded-xl text-white placeholder:text-foreground-muted text-sm font-medium focus:outline-none focus:border-accent/50 focus:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all"
            />
            {searching && <Loader2 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-accent" />}
          </div>
        </motion.div>

        {/* Market Tabs */}
        {!searchQuery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
          >
            {MARKET_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-accent text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                    : "bg-surface-elevated text-foreground-secondary hover:text-white hover:bg-surface-hover border border-border/50"
                }`}
              >
                {tab.label}
                <span className="ml-2 text-xs opacity-60">({tab.data.length})</span>
              </button>
            ))}
          </motion.div>
        )}

        {/* Stock Table */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-surface/40 backdrop-blur-md border border-white/5 rounded-xl overflow-hidden"
        >
          {/* Table Header */}
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-4 py-3 bg-surface-elevated/50 border-b border-border/50 text-xs font-bold text-foreground-muted uppercase tracking-wider">
            <div>Symbol</div>
            <div className="text-right">Price</div>
            <div className="text-right">Change</div>
            <div className="text-right">Volume</div>
            <div className="text-right">Market Cap</div>
            <div className="w-10" />
          </div>

          {/* Loading State */}
          {loadingQuotes && displayStocks.length > 0 && Object.keys(quotes).length === 0 && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-accent mr-3" size={20} />
              <span className="text-foreground-muted text-sm">Loading real-time prices...</span>
            </div>
          )}

          {/* Stock Rows */}
          <div className="max-h-[600px] overflow-y-auto">
            {displayStocks.map((stock, i) => {
              const q = quotes[stock.symbol];
              const isPositive = (q?.changePercent || 0) >= 0;

              return (
                <Link
                  key={stock.symbol}
                  href={`/terminal/${encodeURIComponent(stock.symbol)}`}
                >
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-4 py-3 border-b border-border/20 hover:bg-surface-hover/50 cursor-pointer transition-colors group"
                  >
                    {/* Symbol & Name */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${
                        stock.type === "crypto" ? "bg-amber-500/10 text-amber-400" :
                        stock.type === "forex" ? "bg-emerald-500/10 text-emerald-400" :
                        stock.type === "commodity" ? "bg-orange-500/10 text-orange-400" :
                        stock.type === "index" ? "bg-purple-500/10 text-purple-400" :
                        "bg-accent/10 text-accent"
                      }`}>
                        {getDisplaySymbol(stock.symbol).substring(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-white group-hover:text-accent transition-colors truncate">
                          {getDisplaySymbol(stock.symbol)}
                        </div>
                        <div className="text-[11px] text-foreground-muted truncate">
                          {stock.name}
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right text-sm font-bold font-numeric text-white self-center">
                      {q?.price ? (q.price < 1 ? q.price.toFixed(4) : q.price.toFixed(2)) : "-"}
                    </div>

                    {/* Change */}
                    <div className={`text-right text-sm font-bold font-numeric self-center ${
                      isPositive ? "text-positive" : "text-negative"
                    }`}>
                      {q ? (
                        <div className="flex items-center justify-end gap-1">
                          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                          {isPositive ? "+" : ""}{q.changePercent?.toFixed(2)}%
                        </div>
                      ) : "-"}
                    </div>

                    {/* Volume */}
                    <div className="text-right text-sm font-numeric text-foreground-secondary self-center">
                      {q?.volume ? formatNumber(q.volume) : "-"}
                    </div>

                    {/* Market Cap */}
                    <div className="text-right text-sm font-numeric text-foreground-secondary self-center">
                      {q?.marketCap ? formatNumber(q.marketCap) : "-"}
                    </div>

                    {/* Arrow */}
                    <div className="w-10 flex items-center justify-center self-center">
                      <ArrowRight size={16} className="text-foreground-muted opacity-0 group-hover:opacity-100 group-hover:text-accent transition-all" />
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Empty State */}
          {displayStocks.length === 0 && !loadingQuotes && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Search size={40} className="text-foreground-muted mb-4 opacity-30" />
              <p className="text-foreground-muted text-sm">
                {searchQuery ? `No results found for "${searchQuery}"` : "No stocks in this category"}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </PageWrapper>
  );
}
