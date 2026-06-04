"use client";

import { useState, useEffect, useRef } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Bot, Power, Activity, Terminal as TerminalIcon, ShieldAlert, Cpu, Network, Database, BrainCircuit, BarChart3, TrendingUp, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ARCHITECTURES = [
  { id: "transformer", name: "Order Flow Transformer v4.2", desc: "Attention-based liquidity sweep detection" },
  { id: "drl", name: "Deep RL Actor-Critic", desc: "Adaptive risk weighting & dynamic sizing" },
  { id: "ict-matrix", name: "ICT Matrix Engine", desc: "Fair Value Gap & Killzone alignment" },
];

const TERMINAL_LOGS_MOCK = [
  "[SYSTEM] Initializing Neural Matrix...",
  "[SYSTEM] Connecting to NSE FIX Gateway...",
  "[SYSTEM] Connection established. Ping: 12ms",
  "[MODELS] Loading weights for Transformer v4.2...",
  "[MARKET] Parsing Order Book Depth Level 3...",
  "[AI_CORE] Scanning for unmitigated FVGs...",
  "[RISK] Adjusting dynamic position sizing array...",
  "[AI_CORE] Detected potential buy-side liquidity sweep on BANKNIFTY",
  "[TRADE] Generating hypothetical execution matrix...",
  "[MODELS] Confidence score: 87.4%",
  "[SYSTEM] Waiting for optimal trade entry criteria...",
  "[MARKET] High-Frequency burst detected in Option Chain...",
  "[AI_CORE] Recalculating Greeks...",
  "[TRADE] Neutralizing Delta exposure...",
  "[SYSTEM] Idle. Monitoring tick data..."
];

export default function BotConfigPage() {
  const [isAutoTrading, setIsAutoTrading] = useState(false);
  const [selectedArch, setSelectedArch] = useState("transformer");
  const [logs, setLogs] = useState<string[]>([TERMINAL_LOGS_MOCK[0]]);
  const terminalRef = useRef<HTMLDivElement>(null);
  
  // Performance Metrics
  const [metrics, setMetrics] = useState({
    winRate: 64.2,
    pnl: 14250.50,
    sharpe: 2.14
  });

  // Simulate terminal logs
  useEffect(() => {
    if (!isAutoTrading) return;
    
    let index = 1;
    const interval = setInterval(() => {
      setLogs(prev => {
        const newLogs = [...prev, TERMINAL_LOGS_MOCK[index % TERMINAL_LOGS_MOCK.length]];
        if (newLogs.length > 50) newLogs.shift();
        return newLogs;
      });
      
      // Simulate metric fluctuations
      setMetrics(prev => ({
        winRate: prev.winRate + (Math.random() > 0.5 ? 0.1 : -0.1),
        pnl: prev.pnl + (Math.random() > 0.4 ? (Math.random() * 50) : -(Math.random() * 30)),
        sharpe: prev.sharpe + (Math.random() > 0.5 ? 0.01 : -0.01)
      }));
      
      index++;
    }, 1800);

    return () => clearInterval(interval);
  }, [isAutoTrading]);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <PageWrapper>
      <div className="flex flex-col gap-8 max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border/50 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-accent/10 border border-accent/20 rounded-lg">
                <BrainCircuit className="w-8 h-8 text-accent animate-pulse-ring" />
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-white uppercase font-sans">
                AI Quant <span className="text-foreground-muted font-light">Matrix</span>
              </h1>
            </div>
            <p className="text-foreground-secondary text-sm max-w-2xl font-mono">
              Configure neural architectures, set risk parameters, and monitor autonomous high-frequency execution sequences in real-time.
            </p>
          </div>
          
          <button
            onClick={() => setIsAutoTrading(!isAutoTrading)}
            className={`relative flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-500 border-2 overflow-hidden ${
              isAutoTrading 
                ? "bg-positive/10 border-positive text-positive shadow-[0_0_40px_rgba(16,185,129,0.2)]" 
                : "bg-surface border-border text-foreground-muted hover:border-accent/50 hover:text-white"
            }`}
          >
            {isAutoTrading && (
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-positive/20 to-transparent skew-x-12"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              />
            )}
            <Power className={`w-6 h-6 relative z-10 ${isAutoTrading ? "text-positive" : ""}`} />
            <span className="relative z-10 font-mono tracking-widest">{isAutoTrading ? "SYSTEM ACTIVE" : "SYSTEM OFFLINE"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Configuration */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Architecture Selector */}
            <div className="glass-card p-5 border border-border/50 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -z-10 group-hover:bg-accent/10 transition-colors" />
              <div className="flex items-center gap-2 mb-4 text-white">
                <Network className="w-5 h-5 text-accent" />
                <h2 className="font-bold font-mono text-sm tracking-wide uppercase">Model Architecture</h2>
              </div>
              <div className="space-y-3">
                {ARCHITECTURES.map(arch => (
                  <button
                    key={arch.id}
                    onClick={() => setSelectedArch(arch.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all duration-300 ${
                      selectedArch === arch.id 
                        ? "bg-accent/10 border-accent/50 shadow-[0_0_15px_rgba(59,130,246,0.15)]" 
                        : "bg-surface/50 border-border hover:border-accent/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-mono text-sm font-bold ${selectedArch === arch.id ? "text-accent" : "text-white"}`}>
                        {arch.name}
                      </span>
                      {selectedArch === arch.id && <Activity className="w-4 h-4 text-accent animate-pulse" />}
                    </div>
                    <p className="text-xs text-foreground-muted">{arch.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Risk Protocol Matrix */}
            <div className="glass-card p-5 border border-border/50 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-negative/5 rounded-full blur-3xl -z-10 group-hover:bg-negative/10 transition-colors" />
              <div className="flex items-center gap-2 mb-5 text-white border-b border-border/50 pb-3">
                <ShieldAlert className="w-5 h-5 text-negative" />
                <h2 className="font-bold font-mono text-sm tracking-wide uppercase">Risk Protocol Matrix</h2>
              </div>
              
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-mono text-foreground-secondary uppercase tracking-wider">Max Drawdown Killswitch</label>
                    <span className="text-xs font-mono text-negative font-bold">-2.5%</span>
                  </div>
                  <input type="range" min="0.5" max="5" step="0.1" defaultValue="2.5" className="w-full accent-negative" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-mono text-foreground-secondary uppercase tracking-wider">Position Sizing Alpha</label>
                    <span className="text-xs font-mono text-accent font-bold">Aggressive</span>
                  </div>
                  <select className="w-full bg-[#0A0A0B] border border-border rounded-md px-3 py-2 text-white font-mono text-xs outline-none focus:border-accent">
                    <option>Conservative (Kelly/4)</option>
                    <option>Moderate (Kelly/2)</option>
                    <option selected>Aggressive (Full Kelly)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Terminal & Metrics */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Live Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-card p-4 border border-border/50 flex flex-col relative overflow-hidden group">
                <div className="absolute bottom-0 right-0 p-2 opacity-5">
                  <BarChart3 size={64} />
                </div>
                <span className="text-xs font-mono text-foreground-muted uppercase tracking-wider mb-2">Simulated Win Rate</span>
                <span className={`text-2xl font-mono font-bold ${metrics.winRate > 60 ? "text-positive" : "text-white"}`}>
                  {metrics.winRate.toFixed(2)}%
                </span>
              </div>
              
              <div className="glass-card p-4 border border-border/50 flex flex-col relative overflow-hidden group">
                <div className="absolute bottom-0 right-0 p-2 opacity-5">
                  <TrendingUp size={64} />
                </div>
                <span className="text-xs font-mono text-foreground-muted uppercase tracking-wider mb-2">Matrix Sharpe Ratio</span>
                <span className="text-2xl font-mono font-bold text-accent">
                  {metrics.sharpe.toFixed(2)}
                </span>
              </div>
              
              <div className="glass-card p-4 border border-border/50 flex flex-col relative overflow-hidden group">
                <div className="absolute bottom-0 right-0 p-2 opacity-5">
                  <DollarSign size={64} />
                </div>
                <span className="text-xs font-mono text-foreground-muted uppercase tracking-wider mb-2">Running P&L (Sim)</span>
                <span className={`text-2xl font-mono font-bold ${metrics.pnl > 0 ? "text-positive" : "text-negative"}`}>
                  ₹{metrics.pnl.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Neural Execution Log (Terminal) */}
            <div className="glass-card flex-1 min-h-[400px] border border-border/50 flex flex-col overflow-hidden relative">
              {/* Terminal Header */}
              <div className="bg-[#0A0A0B] border-b border-border/50 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TerminalIcon className="w-4 h-4 text-foreground-secondary" />
                  <span className="font-mono text-xs text-foreground-secondary uppercase tracking-widest">Neural Execution Stream</span>
                </div>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-negative/50" />
                  <div className="w-3 h-3 rounded-full bg-warning/50" />
                  <div className={`w-3 h-3 rounded-full ${isAutoTrading ? "bg-positive shadow-[0_0_8px_rgba(16,185,129,0.8)]" : "bg-positive/20"}`} />
                </div>
              </div>
              
              {/* Terminal Body */}
              <div 
                ref={terminalRef}
                className="flex-1 p-4 bg-[#050505] overflow-y-auto font-mono text-xs leading-relaxed space-y-1.5 scrollbar-hide"
                style={{
                  backgroundImage: "radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.02) 0%, transparent 100%)"
                }}
              >
                {!isAutoTrading ? (
                  <div className="h-full flex items-center justify-center flex-col text-foreground-muted opacity-50">
                    <Database size={48} className="mb-4" />
                    <p>AWAITING SYSTEM INITIALIZATION</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {logs.map((log, i) => {
                      // Color code tags
                      let colorClass = "text-gray-400";
                      if (log.includes("[SYSTEM]")) colorClass = "text-accent";
                      if (log.includes("[MARKET]")) colorClass = "text-foreground-secondary";
                      if (log.includes("[MODELS]")) colorClass = "text-purple-400";
                      if (log.includes("[AI_CORE]")) colorClass = "text-warning";
                      if (log.includes("[TRADE]") || log.includes("[RISK]")) colorClass = "text-positive";

                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`${colorClass} flex items-start gap-3 border-l border-white/5 pl-3`}
                        >
                          <span className="text-gray-600 shrink-0">
                            {new Date().toISOString().split('T')[1].substring(0, 12)}
                          </span>
                          <span className="break-words">{log}</span>
                        </motion.div>
                      );
                    })}
                    {/* Blinking cursor */}
                    <motion.div
                      animate={{ opacity: [1, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                      className="w-2 h-4 bg-accent mt-2 ml-3"
                    />
                  </AnimatePresence>
                )}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </PageWrapper>
  );
}
