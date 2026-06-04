"use client";

import { useState, useEffect } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { LineChart, Filter, Download, SlidersHorizontal, ChevronDown, Check, Workflow, Loader2 } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { getCompanyOverview, getQuote } from "@/lib/api/market";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function ScreenerPage() {
  const [activeTab, setActiveTab] = useState("Fundamental");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Default symbols to scan for the Screener demo
  const SCREEN_SYMBOLS = ["AAPL", "MSFT", "TSLA", "NVDA", "META", "AMZN", "GOOGL"];

  useEffect(() => {
    async function fetchScreenerData() {
      setIsLoading(true);
      try {
        const fetchedResults = await Promise.all(
          SCREEN_SYMBOLS.map(async (sym) => {
            try {
              const [overview, quote] = await Promise.all([
                getCompanyOverview(sym),
                getQuote(sym)
              ]);
              return { ...overview, ...quote };
            } catch (err) {
              console.error("Failed fetching for", sym, err);
              return null;
            }
          })
        );
        setResults(fetchedResults.filter(Boolean));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchScreenerData();
  }, []);

  return (
    <PageWrapper>
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-6 max-w-7xl mx-auto"
      >
        
        {/* Header */}
        <motion.div variants={item} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg border border-accent/20">
                <Workflow className="text-accent" size={28} />
              </div>
              Quantitative Screener
            </h1>
            <p className="text-foreground-secondary text-sm max-w-2xl">
              Filter the market universe using institutional-grade fundamental and technical parameters. Identify structural setups and liquidity anomalies.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-surface-elevated hover:bg-surface-hover border border-border rounded-md text-sm font-medium transition-colors">
              <Download size={16} /> Export CSV
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-md text-sm font-medium transition-colors shadow-[0_0_15px_rgba(37,99,235,0.2)]">
              <Filter size={16} /> Save Screen
            </button>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Filters Sidebar */}
          <motion.div variants={item} className="w-full lg:w-72 flex flex-col gap-4">
            <div className="glass-card p-4 backdrop-blur-md border border-white/5 bg-surface/40">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                  <SlidersHorizontal size={16} className="text-accent" /> Parameters
                </h2>
                <button className="text-xs text-accent hover:text-white transition-colors">Reset</button>
              </div>

              {/* Filter Tabs */}
              <div className="flex bg-surface rounded-md p-1 mb-4">
                {["Fundamental", "Technical"].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors ${
                      activeTab === tab ? "bg-surface-elevated text-white shadow-sm border border-border" : "text-foreground-secondary hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Filter Categories */}
              <div className="space-y-4">
                {activeTab === "Fundamental" ? (
                  <>
                    <FilterGroup title="Market Cap (₹ Cr)" active />
                    <FilterGroup title="P/E Ratio" />
                    <FilterGroup title="ROCE (%)" />
                    <FilterGroup title="Debt to Equity" />
                    <FilterGroup title="Sales Growth (3Yrs)" />
                  </>
                ) : (
                  <>
                    <FilterGroup title="RSI (14)" active />
                    <FilterGroup title="Moving Averages" />
                    <FilterGroup title="52W High Proximity" />
                    <FilterGroup title="MACD Crossover" />
                    <FilterGroup title="Volume Spike" />
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* Results Table */}
          <motion.div variants={item} className="flex-1 glass-card overflow-hidden flex flex-col backdrop-blur-md border border-white/5 bg-surface/40">
            <div className="p-4 border-b border-border/50 flex justify-between items-center bg-surface-elevated/50">
              <h2 className="text-sm font-medium text-white flex items-center gap-2">
                <span className="text-accent font-bold">{isLoading ? "-" : results.length}</span> Matches Found
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-foreground-muted">Sort by:</span>
                <button className="flex items-center gap-1 text-xs font-medium text-white bg-surface border border-border px-2 py-1 rounded">
                  Market Cap <ChevronDown size={14} />
                </button>
              </div>
            </div>

            <div className="table-wrapper flex-1">
              <table className="data-table">
                <thead className="bg-surface sticky top-0 z-10">
                  <tr>
                    <th className="w-10 text-center"><input type="checkbox" className="rounded border-border bg-background text-accent" /></th>
                    <th>Symbol</th>
                    <th className="text-right">Price</th>
                    <th className="text-right">Market Cap</th>
                    <th className="text-right">P/E</th>
                    <th className="text-right">ROCE</th>
                    <th className="text-right">1Y Return</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-foreground-muted">
                        <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                        Running Algorithmic Screen...
                      </td>
                    </tr>
                  ) : results.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-foreground-muted">
                        No matches found based on current criteria.
                      </td>
                    </tr>
                  ) : (
                    results.map((stock, i) => (
                      <tr key={stock.symbol || i} className="group cursor-pointer">
                        <td className="text-center">
                          <input type="checkbox" className="rounded border-border bg-background text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </td>
                        <td className="font-medium text-white group-hover:text-accent transition-colors">{stock.symbol}</td>
                        <td className="text-right font-numeric">${stock.price || "0.00"}</td>
                        <td className="text-right font-numeric text-foreground-secondary">{stock.MarketCapitalization ? (parseInt(stock.MarketCapitalization) / 1e9).toFixed(1) + 'B' : stock.marketCap || "-"}</td>
                        <td className="text-right font-numeric text-foreground-secondary">{stock.PERatio || stock.peRatio || "-"}</td>
                        <td className="text-right font-numeric text-positive">{stock.changePercent || "-"}</td>
                        <td className="text-right font-numeric text-positive">{stock.EPS || stock.eps || "-"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="p-3 border-t border-border/50 bg-surface-elevated/50 flex justify-between items-center text-xs text-foreground-secondary">
              <span>Showing 1-10 of 124</span>
              <div className="flex gap-1">
                <button className="px-2 py-1 border border-border rounded bg-surface hover:text-white disabled:opacity-50">Prev</button>
                <button className="px-2 py-1 border border-accent bg-accent/10 text-accent rounded">1</button>
                <button className="px-2 py-1 border border-border rounded bg-surface hover:text-white">2</button>
                <button className="px-2 py-1 border border-border rounded bg-surface hover:text-white">3</button>
                <button className="px-2 py-1 border border-border rounded bg-surface hover:text-white">Next</button>
              </div>
            </div>

          </motion.div>

        </div>
      </motion.div>
    </PageWrapper>
  );
}

function FilterGroup({ title, active = false }: { title: string, active?: boolean }) {
  return (
    <div className="border border-border rounded-md overflow-hidden bg-surface-elevated">
      <button className="w-full px-3 py-2 text-sm font-medium text-left flex justify-between items-center text-foreground-secondary hover:text-white hover:bg-surface transition-colors">
        {title}
        <ChevronDown size={14} className={`transition-transform ${active ? "rotate-180" : ""}`} />
      </button>
      {active && (
        <div className="p-3 border-t border-border bg-background">
          <div className="flex items-center justify-between text-xs text-foreground-muted mb-2">
            <span>Min</span>
            <span>Max</span>
          </div>
          <div className="flex items-center gap-2">
            <input type="text" className="w-full bg-surface border border-border rounded px-2 py-1 text-xs text-white" placeholder="0" />
            <span className="text-foreground-muted">-</span>
            <input type="text" className="w-full bg-surface border border-border rounded px-2 py-1 text-xs text-white" placeholder="1000" />
          </div>
        </div>
      )}
    </div>
  );
}
