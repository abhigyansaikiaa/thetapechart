"use client";

import { useState } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Eye, Bell, Plus, MoreHorizontal } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { StockCard } from "@/components/trading/StockCard";

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

const mockWatchlists = [
  { id: "1", name: "Tech Breakouts" },
  { id: "2", name: "SMC Setups" },
  { id: "3", name: "Long Term Core" },
];

const mockStocks = [
  { symbol: "TCS", price: 3980.15, change: 80.50, changePercent: 2.06, volume: 0, marketCap: 0 },
  { symbol: "INFY", price: 1450.25, change: 25.10, changePercent: 1.76, volume: 0, marketCap: 0 },
  { symbol: "WIPRO", price: 460.80, change: -5.20, changePercent: -1.12, volume: 0, marketCap: 0 },
  { symbol: "HCLTECH", price: 1560.40, change: 12.30, changePercent: 0.79, volume: 0, marketCap: 0 },
];

export default function WatchlistPage() {
  const [activeList, setActiveList] = useState(mockWatchlists[0].id);

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
                <Eye className="text-accent" size={28} />
              </div>
              Watchlists & Alerts
            </h1>
            <p className="text-foreground-secondary text-sm max-w-2xl">
              Track multi-timeframe structural setups and configure precision algorithmic price alerts.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-surface-elevated hover:bg-surface-hover border border-border rounded-md text-sm font-medium transition-colors shadow-sm">
              <Bell size={16} /> Manage Alerts
            </button>
          </div>
        </motion.div>

        {/* Watchlist Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide border-b border-border/50">
          {mockWatchlists.map(list => (
            <button
              key={list.id}
              onClick={() => setActiveList(list.id)}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                activeList === list.id 
                  ? "text-accent border-accent" 
                  : "text-foreground-secondary border-transparent hover:text-white"
              }`}
            >
              {list.name}
            </button>
          ))}
          <button className="px-3 py-2 text-foreground-secondary hover:text-white transition-colors ml-2 flex items-center gap-1">
            <Plus size={16} /> <span className="text-sm font-medium">New List</span>
          </button>
        </div>

        {/* Action Bar */}
        <motion.div variants={item} className="flex justify-between items-center bg-surface-elevated p-3 rounded-lg border border-border/50 backdrop-blur-md">
          <div className="flex-1 max-w-sm">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Add symbol to watchlist..." 
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 text-accent p-1 hover:bg-accent/10 rounded">
                <Plus size={16} />
              </button>
            </div>
          </div>
          <button className="p-2 text-foreground-secondary hover:text-white rounded-md hover:bg-surface transition-colors">
            <MoreHorizontal size={20} />
          </button>
        </motion.div>

        {/* Stocks Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {mockStocks.map(stock => (
            <StockCard key={stock.symbol} data={stock} />
          ))}
        </motion.div>

        {/* Alerts Section Placeholder */}
        <motion.div variants={item} className="mt-8 glass-card p-6 backdrop-blur-md border border-white/5 bg-surface/40">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Bell size={18} className="text-accent" />
            Active Alerts
          </h2>
          <div className="bg-surface border border-border rounded-lg p-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="font-bold text-white">TCS</span>
              <span className="text-xs bg-surface-elevated px-2 py-1 rounded text-foreground-secondary">Crosses Above</span>
              <span className="font-numeric text-white font-medium">₹4000.00</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-foreground-muted flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-positive animate-pulse-glow"></span>
                Active
              </span>
              <button className="text-xs text-negative hover:underline">Delete</button>
            </div>
          </div>
        </motion.div>

      </motion.div>
    </PageWrapper>
  );
}
