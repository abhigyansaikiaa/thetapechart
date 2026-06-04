"use client";

import { useState, useEffect, useRef } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Filter, Download, SlidersHorizontal, ChevronDown, Workflow, Loader2, Play, Pause, Activity, Zap } from "lucide-react";
import { motion, Variants, AnimatePresence } from "framer-motion";

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

// Mock data with "Alpha Scores" and "Smart Money" metrics
const INITIAL_RESULTS = [
  { symbol: "TCS", price: 3950.45, cap: "1.44T", pe: 31.2, roce: 42.1, return1y: 24.5, alphaScore: 88, smFlow: "High" },
  { symbol: "HDFCBANK", price: 1420.30, cap: "1.08T", pe: 15.4, roce: 18.2, return1y: -12.4, alphaScore: 65, smFlow: "Accumulation" },
  { symbol: "RELIANCE", price: 2890.10, cap: "1.95T", pe: 28.5, roce: 10.4, return1y: 18.2, alphaScore: 72, smFlow: "Neutral" },
  { symbol: "INFY", price: 1620.75, cap: "670B", pe: 24.1, roce: 31.5, return1y: 15.6, alphaScore: 81, smFlow: "High" },
  { symbol: "ICICIBANK", price: 1050.25, cap: "740B", pe: 18.2, roce: 14.8, return1y: 22.1, alphaScore: 92, smFlow: "High" },
  { symbol: "ITC", price: 410.80, cap: "510B", pe: 25.6, roce: 38.4, return1y: 8.5, alphaScore: 78, smFlow: "Distribution" },
];

const SCAN_LOGS_POOL = [
  "Parsing Order Book Depth for NIFTY50 components...",
  "Applying Smart Money Concept (SMC) filters...",
  "Searching for Unmitigated FVGs on Daily timeframe...",
  "Calculating Alpha Score based on Momentum & Volatility...",
  "Filtering out stocks with Debt/Equity > 1.5...",
  "Running ROE & ROCE comparative matrix...",
  "Checking Dark Pool liquidity anomalies...",
  "Cross-referencing Options Chain for Put-Call anomalies...",
];

export default function ScreenerPage() {
  const [activeTab, setActiveTab] = useState("Fundamental");
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<any[]>(INITIAL_RESULTS);
  const [scanLogs, setScanLogs] = useState<string[]>(["System Idle. Ready for parameters."]);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isScanning) return;
    
    let index = 0;
    setScanLogs(["[INIT] Booting Algorithmic Screener Engine..."]);
    setResults([]);

    const logInterval = setInterval(() => {
      setScanLogs(prev => {
        const newLogs = [...prev, `[SCAN] ${SCAN_LOGS_POOL[index % SCAN_LOGS_POOL.length]}`];
        if (newLogs.length > 8) newLogs.shift();
        return newLogs;
      });
      index++;
    }, 800);

    const resultTimeout = setTimeout(() => {
      setIsScanning(false);
      setScanLogs(prev => [...prev, "[SUCCESS] Scan Complete. 6 anomalies detected."]);
      setResults(INITIAL_RESULTS); // In a real app, this would be fresh data
    }, 5000);

    return () => {
      clearInterval(logInterval);
      clearTimeout(resultTimeout);
    };
  }, [isScanning]);

  // Auto-scroll logs
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [scanLogs]);

  return (
    <PageWrapper>
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-6 max-w-7xl mx-auto"
      >
        
        {/* Header */}
        <motion.div variants={item} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-border/50 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2 flex items-center gap-3 font-sans">
              <div className="p-2 bg-accent/10 rounded-lg border border-accent/20">
                <Workflow className="text-accent" size={28} />
              </div>
              Quantitative Screener
            </h1>
            <p className="text-foreground-secondary text-sm max-w-2xl font-mono">
              Execute institutional-grade filters across Fundamental, Technical, and Dark Pool parameters to isolate market anomalies.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-surface-elevated hover:bg-surface-hover border border-border rounded-md text-sm font-medium transition-colors">
              <Download size={16} /> Export CSV
            </button>
            <button 
              onClick={() => setIsScanning(!isScanning)}
              className={`flex items-center gap-2 px-6 py-2 text-white rounded-md text-sm font-bold transition-all ${
                isScanning 
                  ? "bg-warning hover:bg-warning/80 shadow-[0_0_20px_rgba(245,158,11,0.3)]" 
                  : "bg-accent hover:bg-accent-hover shadow-[0_0_15px_rgba(37,99,235,0.2)]"
              }`}
            >
              {isScanning ? <><Pause size={16} /> Halt Scan</> : <><Play size={16} /> Run Engine</>}
            </button>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Filters Sidebar */}
          <motion.div variants={item} className="w-full lg:w-72 flex flex-col gap-4">
            <div className="glass-card p-4 backdrop-blur-md border border-white/5 bg-surface/40">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
                  <SlidersHorizontal size={16} className="text-accent" /> Matrix Parameters
                </h2>
                <button className="text-xs text-accent hover:text-white transition-colors">Reset</button>
              </div>

              {/* Filter Tabs */}
              <div className="flex bg-[#0A0A0B] rounded-md p-1 mb-4 border border-border">
                {["Fundamental", "Technical", "Liquidity"].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded transition-colors ${
                      activeTab === tab ? "bg-accent text-white shadow-sm" : "text-foreground-secondary hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Filter Categories */}
              <div className="space-y-4">
                {activeTab === "Fundamental" && (
                  <>
                    <FilterGroup title="Market Cap (₹ Cr)" active />
                    <FilterGroup title="P/E Ratio" />
                    <FilterGroup title="ROCE (%)" />
                    <FilterGroup title="Debt to Equity" />
                  </>
                )}
                {activeTab === "Technical" && (
                  <>
                    <FilterGroup title="RSI (14)" active />
                    <FilterGroup title="MACD Divergence" />
                    <FilterGroup title="Volatility Contraction" />
                    <FilterGroup title="Moving Averages" />
                  </>
                )}
                {activeTab === "Liquidity" && (
                  <>
                    <FilterGroup title="Smart Money Index" active />
                    <FilterGroup title="Dark Pool Accumulation" />
                    <FilterGroup title="Options Gamma Exposure" />
                  </>
                )}
              </div>
            </div>
            
            {/* Active Scan Terminal */}
            <div className="glass-card flex-1 min-h-[200px] border border-border/50 flex flex-col overflow-hidden">
              <div className="bg-[#0A0A0B] border-b border-border/50 px-3 py-2 flex items-center gap-2">
                <Activity className="w-4 h-4 text-accent" />
                <span className="font-mono text-[10px] text-foreground-secondary uppercase tracking-widest">Engine Logs</span>
                {isScanning && <div className="ml-auto w-2 h-2 rounded-full bg-positive animate-pulse" />}
              </div>
              <div 
                ref={logRef}
                className="flex-1 p-3 bg-[#050505] overflow-y-auto font-mono text-[10px] leading-relaxed space-y-1 scrollbar-hide text-gray-500"
              >
                <AnimatePresence>
                  {scanLogs.map((log, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={log.includes("[SUCCESS]") ? "text-positive" : log.includes("[INIT]") ? "text-accent" : ""}
                    >
                      {log}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Results Table */}
          <motion.div variants={item} className="flex-1 glass-card overflow-hidden flex flex-col backdrop-blur-md border border-white/5 bg-surface/40">
            <div className="p-4 border-b border-border/50 flex justify-between items-center bg-surface-elevated/50">
              <h2 className="text-sm font-bold font-mono text-white flex items-center gap-2 uppercase tracking-wide">
                <span className="text-accent">{isScanning ? "..." : results.length}</span> Anomalies Detected
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-foreground-muted font-mono">Sort:</span>
                <button className="flex items-center gap-1 text-xs font-bold font-mono text-white bg-[#0A0A0B] border border-border px-3 py-1.5 rounded">
                  Alpha Score <ChevronDown size={14} className="text-accent" />
                </button>
              </div>
            </div>

            <div className="table-wrapper flex-1 relative">
              {isScanning && (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
                  <div className="relative">
                    <Loader2 className="animate-spin text-accent" size={48} />
                    <div className="absolute inset-0 animate-ping opacity-20 border-2 border-accent rounded-full"></div>
                  </div>
                  <p className="mt-4 font-mono text-sm text-white tracking-widest uppercase">Executing Neural Scan</p>
                </div>
              )}
              
              <table className="data-table">
                <thead className="bg-[#0A0A0B] sticky top-0 z-10 font-mono text-[11px] uppercase tracking-wider text-foreground-secondary">
                  <tr>
                    <th className="w-10 text-center border-r border-border/50">#</th>
                    <th className="border-r border-border/50">Symbol / Price</th>
                    <th className="text-right border-r border-border/50">Alpha Score</th>
                    <th className="text-right border-r border-border/50">Smart Money</th>
                    <th className="text-right border-r border-border/50">P/E</th>
                    <th className="text-right border-r border-border/50">ROCE</th>
                    <th className="text-right">1Y Trend</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {results.length === 0 && !isScanning ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-foreground-muted font-mono">
                        No anomalies match the current matrix parameters.
                      </td>
                    </tr>
                  ) : (
                    results.map((stock, i) => (
                      <tr key={stock.symbol} className="group hover:bg-accent/5 cursor-pointer border-b border-border/50">
                        <td className="text-center font-mono text-foreground-muted border-r border-border/50">{i + 1}</td>
                        <td className="border-r border-border/50">
                          <p className="font-bold font-mono text-white group-hover:text-accent transition-colors">{stock.symbol}</p>
                          <p className="text-xs text-foreground-secondary font-numeric font-medium">₹{stock.price.toFixed(2)}</p>
                        </td>
                        <td className="text-right border-r border-border/50">
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-xs font-mono font-bold text-white">{stock.alphaScore}/100</span>
                            <div className="w-16 h-1.5 bg-background rounded-full overflow-hidden border border-border">
                              <div className="h-full bg-accent" style={{ width: `${stock.alphaScore}%` }}></div>
                            </div>
                          </div>
                        </td>
                        <td className="text-right border-r border-border/50">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                            stock.smFlow === 'High' || stock.smFlow === 'Accumulation' 
                              ? "bg-positive/10 text-positive border-positive/20" 
                              : stock.smFlow === 'Distribution' 
                                ? "bg-negative/10 text-negative border-negative/20"
                                : "bg-surface-elevated text-foreground-secondary border-border"
                          }`}>
                            {stock.smFlow === 'High' && <Zap size={10} />}
                            {stock.smFlow}
                          </span>
                        </td>
                        <td className="text-right font-numeric text-foreground-secondary border-r border-border/50">{stock.pe}</td>
                        <td className="text-right font-numeric text-white font-medium border-r border-border/50">{stock.roce}%</td>
                        <td className="text-right pr-4">
                          <div className="flex items-center justify-end gap-3">
                            <span className={`font-numeric font-bold ${stock.return1y > 0 ? "text-positive" : "text-negative"}`}>
                              {stock.return1y > 0 ? "+" : ""}{stock.return1y}%
                            </span>
                            {/* CSS-only sparkline mock */}
                            <div className="flex items-end gap-[1px] h-4 w-12 opacity-70">
                              {[...Array(6)].map((_, idx) => (
                                <div key={idx} className={`w-1.5 ${stock.return1y > 0 ? "bg-positive" : "bg-negative"}`} style={{ height: `${Math.max(20, Math.random() * 100)}%` }}></div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </motion.div>

        </div>
      </motion.div>
    </PageWrapper>
  );
}

function FilterGroup({ title, active = false }: { title: string, active?: boolean }) {
  return (
    <div className="border border-border/80 rounded-md overflow-hidden bg-surface-elevated/50">
      <button className="w-full px-3 py-2.5 text-xs font-bold font-mono tracking-wide text-left flex justify-between items-center text-foreground-secondary hover:text-white hover:bg-surface transition-colors">
        {title}
        <ChevronDown size={14} className={`transition-transform text-accent ${active ? "rotate-180" : ""}`} />
      </button>
      {active && (
        <div className="p-3 border-t border-border/80 bg-[#0A0A0B]">
          <div className="flex items-center justify-between text-[10px] font-mono text-foreground-muted mb-2 uppercase">
            <span>Min</span>
            <span>Max</span>
          </div>
          <div className="flex items-center gap-2">
            <input type="text" className="w-full bg-surface border border-border rounded px-2 py-1.5 font-numeric text-xs text-white focus:outline-none focus:border-accent" placeholder="0" />
            <span className="text-foreground-muted">-</span>
            <input type="text" className="w-full bg-surface border border-border rounded px-2 py-1.5 font-numeric text-xs text-white focus:outline-none focus:border-accent" placeholder="Max" />
          </div>
        </div>
      )}
    </div>
  );
}
