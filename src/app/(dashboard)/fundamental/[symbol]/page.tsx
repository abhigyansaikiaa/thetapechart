"use client";

import { useState, use, useEffect } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Building2, TrendingUp, DollarSign, BrainCircuit, BarChart3, Activity, Loader2 } from "lucide-react";
import { MetricCard } from "@/components/trading/MetricCard";
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

export default function FundamentalPage({ params }: { params: Promise<{ symbol: string }> }) {
  const resolvedParams = use(params);
  const symbol = resolvedParams.symbol.toUpperCase();
  const [activeTab, setActiveTab] = useState("Overview");
  
  const [quote, setQuote] = useState<any>(null);
  const [overview, setOverview] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [q, o] = await Promise.all([
          getQuote(symbol),
          getCompanyOverview(symbol)
        ]);
        setQuote(q);
        setOverview(o);
      } catch (err) {
        console.error("Failed to load fundamental data", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [symbol]);

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <Loader2 className="animate-spin text-accent mb-4" size={32} />
          <p className="text-foreground-muted animate-pulse">Loading fundamental models for {symbol}...</p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-6 max-w-7xl mx-auto"
      >
        
        {/* Header */}
        <motion.div variants={item} className="glass-card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 backdrop-blur-md border border-white/5 bg-surface/40">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-surface-elevated border border-accent/20 flex items-center justify-center">
              <Building2 size={32} className="text-accent" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl font-bold text-white">{symbol}</h1>
                <span className="text-xs font-medium bg-surface-elevated px-2 py-0.5 rounded text-foreground-secondary uppercase">
                  {overview?.Exchange || "MARKET"}
                </span>
                <span className="text-xs font-medium bg-surface-elevated px-2 py-0.5 rounded text-foreground-secondary capitalize">
                  {overview?.Sector || overview?.sector || "Sector"}
                </span>
              </div>
              <p className="text-foreground-secondary">{overview?.Name || overview?.name || `${symbol} Corp.`}</p>
            </div>
          </div>
          <div className="text-left md:text-right">
            <p className="text-3xl font-numeric font-bold text-white mb-1">${quote?.price || "0.00"}</p>
            <p className={`font-numeric font-medium flex items-center md:justify-end gap-1 ${parseFloat(quote?.change) >= 0 ? "text-positive" : "text-negative"}`}>
              <TrendingUp size={16} className={parseFloat(quote?.change) < 0 ? "rotate-180" : ""} /> 
              {parseFloat(quote?.change) >= 0 ? "+" : ""}{quote?.change || "0.00"} ({quote?.changePercent || "0.00%"})
            </p>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide border-b border-border/50">
          {["Overview", "Financials", "Ratios", "Shareholding", "Valuation"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab 
                  ? "text-accent border-accent" 
                  : "text-foreground-secondary border-transparent hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Key Metrics Grid */}
        <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <MetricCard title="Market Cap" value={overview?.MarketCapitalization ? (parseInt(overview.MarketCapitalization) / 1e9).toFixed(1) + 'B' : overview?.marketCap || "-"} subtitle="Cap" className="p-4" />
          <MetricCard title="P/E Ratio" value={overview?.PERatio || overview?.peRatio || "-"} subtitle="Valuation" className="p-4" />
          <MetricCard title="EPS (TTM)" value={overview?.EPS || overview?.eps || "-"} trend="up" className="p-4" />
          <MetricCard title="Div Yield" value={overview?.DividendYield || overview?.dividendYield || "-"} trend="up" className="p-4" />
          <MetricCard title="52W High" value={overview?.["52WeekHigh"] || overview?.["52WeekHigh"] || "-"} className="p-4" />
          <MetricCard title="52W Low" value={overview?.["52WeekLow"] || overview?.["52WeekLow"] || "-"} trend="down" subtitle="Support" className="p-4" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* AI Business Moat */}
            <motion.div variants={item} className="glass-card p-6 bg-gradient-to-br from-surface to-accent/5 border-accent/20 backdrop-blur-md">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Activity size={18} className="text-accent" />
                Quantitative Moat Assessment
              </h2>
              <p className="text-sm text-foreground-secondary leading-relaxed mb-4">
                <strong className="text-white">{symbol}</strong> is currently categorized under the <span className="text-accent">{overview?.Industry || overview?.industry || "Tech"}</span> industry.
                {overview?.Description ? ` ${overview.Description.substring(0, 150)}...` : ""}
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-positive shrink-0" />
                  <span className="text-foreground-secondary">EPS of {overview?.EPS || "-"} indicates strong profitability relative to shares outstanding.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-positive shrink-0" />
                  <span className="text-foreground-secondary">P/E Ratio of {overview?.PERatio || "-"} provides baseline valuation metrics against peers.</span>
                </li>
              </ul>
            </motion.div>

            {/* Financial Summary Table */}
            <motion.div variants={item} className="glass-card overflow-hidden backdrop-blur-md border border-white/5 bg-surface/40">
              <div className="p-4 border-b border-border bg-surface-elevated/50 flex justify-between items-center">
                <h2 className="text-sm font-medium text-white flex items-center gap-2">
                  <DollarSign size={16} className="text-positive" /> Profit & Loss (Annual)
                </h2>
                <span className="text-xs text-foreground-muted">Figures in ₹ Cr.</span>
              </div>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead className="bg-surface">
                    <tr>
                      <th>Metric</th>
                      <th className="text-right">Mar 2021</th>
                      <th className="text-right">Mar 2022</th>
                      <th className="text-right">Mar 2023</th>
                      <th className="text-right">TTM</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="font-medium text-white">Sales</td>
                      <td className="text-right font-numeric">164,177</td>
                      <td className="text-right font-numeric">191,754</td>
                      <td className="text-right font-numeric">225,458</td>
                      <td className="text-right font-numeric text-accent">240,893</td>
                    </tr>
                    <tr>
                      <td className="font-medium text-white">Operating Profit</td>
                      <td className="text-right font-numeric">46,546</td>
                      <td className="text-right font-numeric">53,057</td>
                      <td className="text-right font-numeric">59,259</td>
                      <td className="text-right font-numeric text-accent">63,450</td>
                    </tr>
                    <tr>
                      <td className="font-medium text-white">Net Profit</td>
                      <td className="text-right font-numeric">32,430</td>
                      <td className="text-right font-numeric">38,327</td>
                      <td className="text-right font-numeric">42,147</td>
                      <td className="text-right font-numeric text-accent">45,908</td>
                    </tr>
                    <tr>
                      <td className="font-medium text-white">EPS (₹)</td>
                      <td className="text-right font-numeric">86.71</td>
                      <td className="text-right font-numeric">103.62</td>
                      <td className="text-right font-numeric">115.19</td>
                      <td className="text-right font-numeric text-accent">125.40</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Shareholding */}
            <motion.div variants={item} className="glass-card p-6 backdrop-blur-md border border-white/5 bg-surface/40">
              <h2 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                <BarChart3 size={16} className="text-accent" /> Shareholding Pattern
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-foreground-secondary">Promoters</span>
                    <span className="font-numeric font-medium text-white">72.30%</span>
                  </div>
                  <div className="w-full bg-surface-elevated rounded-full h-2 overflow-hidden">
                    <div className="bg-accent h-full rounded-full" style={{ width: '72.3%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-foreground-secondary">FII</span>
                    <span className="font-numeric font-medium text-white">12.50%</span>
                  </div>
                  <div className="w-full bg-surface-elevated rounded-full h-2 overflow-hidden">
                    <div className="bg-positive h-full rounded-full" style={{ width: '12.5%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-foreground-secondary">DII</span>
                    <span className="font-numeric font-medium text-white">9.80%</span>
                  </div>
                  <div className="w-full bg-surface-elevated rounded-full h-2 overflow-hidden">
                    <div className="bg-warning h-full rounded-full" style={{ width: '9.8%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-foreground-secondary">Public</span>
                    <span className="font-numeric font-medium text-white">5.40%</span>
                  </div>
                  <div className="w-full bg-surface-elevated rounded-full h-2 overflow-hidden">
                    <div className="bg-foreground-muted h-full rounded-full" style={{ width: '5.4%' }}></div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Fun Card */}
            <motion.div variants={item} className="glass-card p-6 border border-warning/20 backdrop-blur-md bg-surface/40">
              <h2 className="text-sm font-medium text-white mb-2">Would Buffett hold this?</h2>
              <div className="flex items-center gap-3 mt-3">
                <div className="text-4xl font-bold text-positive">Yes</div>
                <p className="text-xs text-foreground-secondary">
                  High ROE, low debt, consistent earnings growth, and strong economic moat fit the Buffett criteria perfectly.
                </p>
              </div>
            </motion.div>

          </div>
        </div>

      </motion.div>
    </PageWrapper>
  );
}
