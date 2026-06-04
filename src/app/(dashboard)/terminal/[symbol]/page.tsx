"use client";

import { useState, useEffect, use } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { TradingViewWidget } from "@/components/tools/TradingViewWidget";
import { StockAIAnalysis } from "@/components/tools/StockAIAnalysis";
import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp, TrendingDown, Globe, Building2, BarChart3, Loader2 } from "lucide-react";
import Link from "next/link";
import { getTradingViewSymbol, getDisplaySymbol } from "@/lib/api/stockUniverse";

interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  dayHigh: number;
  dayLow: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  pe: number | null;
  eps: number | null;
  currency: string;
  exchange: string;
  sector: string;
  industry: string;
}

export default function StockDetailPage({ params }: { params: Promise<{ symbol: string }> }) {
  const resolvedParams = use(params);
  const rawSymbol = decodeURIComponent(resolvedParams.symbol);
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [loading, setLoading] = useState(true);

  const tvSymbol = getTradingViewSymbol(rawSymbol, rawSymbol.endsWith("USDT") ? "crypto" : "stock");
  const displaySym = getDisplaySymbol(rawSymbol);

  useEffect(() => {
    async function fetchQuote() {
      setLoading(true);
      try {
        const res = await fetch(`/api/proxy/yahoo-quote?symbols=${encodeURIComponent(rawSymbol)}`);
        const data = await res.json();
        if (data.quotes?.[0]) {
          setQuote(data.quotes[0]);
        }
      } catch (err) {
        console.error("Failed to fetch quote:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchQuote();
    // Auto-refresh every 30s
    const interval = setInterval(fetchQuote, 30000);
    return () => clearInterval(interval);
  }, [rawSymbol]);

  const isPositive = (quote?.changePercent || 0) >= 0;
  const currencySymbol = quote?.currency === "INR" ? "₹" : quote?.currency === "EUR" ? "€" : quote?.currency === "GBP" ? "£" : "$";

  const formatLargeNumber = (n: number) => {
    if (!n) return "-";
    if (n >= 1e12) return `${currencySymbol}${(n / 1e12).toFixed(2)}T`;
    if (n >= 1e9) return `${currencySymbol}${(n / 1e9).toFixed(2)}B`;
    if (n >= 1e6) return `${currencySymbol}${(n / 1e6).toFixed(2)}M`;
    return `${currencySymbol}${n.toFixed(2)}`;
  };

  return (
    <PageWrapper className="pb-8">
      {/* Back Button + Stock Header */}
      <div className="flex flex-col gap-4 mb-6">
        <Link
          href="/terminal"
          className="flex items-center gap-2 text-sm text-foreground-muted hover:text-accent transition-colors w-fit"
        >
          <ArrowLeft size={16} />
          Back to Terminal
        </Link>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center shadow-lg shadow-accent/20">
              <span className="text-white font-black text-lg">{displaySym.substring(0, 2)}</span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                {displaySym}
                {quote?.exchange && (
                  <span className="text-xs text-foreground-muted bg-surface-elevated px-2 py-0.5 rounded border border-border font-medium">
                    {quote.exchange}
                  </span>
                )}
              </h1>
              <p className="text-foreground-secondary text-sm">{quote?.name || rawSymbol}</p>
            </div>
          </div>

          {/* Live Price */}
          {loading ? (
            <Loader2 className="animate-spin text-accent" size={24} />
          ) : quote ? (
            <div className="text-right">
              <div className="text-3xl font-extrabold font-numeric text-white">
                {currencySymbol}{quote.price < 1 ? quote.price.toFixed(4) : quote.price.toFixed(2)}
              </div>
              <div className={`flex items-center justify-end gap-1 text-sm font-bold ${isPositive ? "text-positive" : "text-negative"}`}>
                {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {isPositive ? "+" : ""}{quote.change?.toFixed(2)} ({isPositive ? "+" : ""}{quote.changePercent?.toFixed(2)}%)
              </div>
            </div>
          ) : null}
        </motion.div>
      </div>

      {/* Main Content: Chart + Analysis Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        {/* Left: TradingView Chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col gap-4"
        >
          <TradingViewWidget symbol={tvSymbol} height={610} />

          {/* Stock Info Cards */}
          {quote && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Day Range", value: `${currencySymbol}${quote.dayLow?.toFixed(2)} — ${currencySymbol}${quote.dayHigh?.toFixed(2)}`, icon: BarChart3 },
                { label: "52W Range", value: `${currencySymbol}${quote.fiftyTwoWeekLow?.toFixed(2)} — ${currencySymbol}${quote.fiftyTwoWeekHigh?.toFixed(2)}`, icon: TrendingUp },
                { label: "Market Cap", value: formatLargeNumber(quote.marketCap), icon: Building2 },
                { label: "Volume", value: formatLargeNumber(quote.volume), icon: BarChart3 },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-surface-elevated rounded-xl p-3 border border-border/40"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <item.icon size={12} className="text-foreground-muted" />
                    <span className="text-[10px] text-foreground-muted font-bold uppercase tracking-widest">{item.label}</span>
                  </div>
                  <div className="text-xs font-bold font-numeric text-white">{item.value}</div>
                </div>
              ))}
            </div>
          )}

          {/* Additional Fundamentals */}
          {quote && (quote.pe || quote.eps || quote.sector) && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {quote.pe && (
                <div className="bg-surface-elevated rounded-xl p-3 border border-border/40">
                  <div className="text-[10px] text-foreground-muted font-bold uppercase tracking-widest mb-1">P/E Ratio</div>
                  <div className="text-sm font-bold font-numeric text-white">{quote.pe.toFixed(2)}</div>
                </div>
              )}
              {quote.eps && (
                <div className="bg-surface-elevated rounded-xl p-3 border border-border/40">
                  <div className="text-[10px] text-foreground-muted font-bold uppercase tracking-widest mb-1">EPS</div>
                  <div className="text-sm font-bold font-numeric text-white">{currencySymbol}{quote.eps.toFixed(2)}</div>
                </div>
              )}
              {quote.sector && (
                <div className="bg-surface-elevated rounded-xl p-3 border border-border/40 col-span-2">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Globe size={12} className="text-foreground-muted" />
                    <span className="text-[10px] text-foreground-muted font-bold uppercase tracking-widest">Sector</span>
                  </div>
                  <div className="text-xs font-bold text-white">{quote.sector}{quote.industry ? ` · ${quote.industry}` : ""}</div>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Right: AI Analysis Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-4"
        >
          <div className="bg-surface/40 backdrop-blur-md border border-white/5 rounded-xl p-5 sticky top-20">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center">
                <BarChart3 size={14} className="text-white" />
              </div>
              AI Trade Analysis
            </h2>

            {quote ? (
              <StockAIAnalysis
                stockData={{
                  symbol: rawSymbol,
                  name: quote.name,
                  price: quote.price,
                  change: quote.change,
                  changePercent: quote.changePercent,
                  dayHigh: quote.dayHigh,
                  dayLow: quote.dayLow,
                  fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh,
                  fiftyTwoWeekLow: quote.fiftyTwoWeekLow,
                  volume: quote.volume,
                  marketCap: quote.marketCap,
                  pe: quote.pe,
                  eps: quote.eps,
                }}
              />
            ) : loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="animate-spin text-accent" size={24} />
              </div>
            ) : (
              <p className="text-sm text-foreground-muted text-center py-8">
                Unable to load stock data. Check your connection and try again.
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
