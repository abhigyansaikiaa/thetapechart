"use client";

import { useState } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { PieChart, TrendingUp, Search, ShieldCheck, ChevronRight, Activity } from "lucide-react";
import { MetricCard } from "@/components/trading/MetricCard";

const mfCategories = ["Equity", "Debt", "Hybrid", "Index", "ELSS"];

const mockFunds = [
  { id: 1, name: "Parag Parikh Flexi Cap Fund Direct Growth", category: "Flexi Cap", cagr3y: 22.4, aum: 54300, risk: "Very High" },
  { id: 2, name: "Quant Small Cap Fund Direct Plan Growth", category: "Small Cap", cagr3y: 38.5, aum: 12400, risk: "Very High" },
  { id: 3, name: "HDFC Index Fund Nifty 50 Plan Direct", category: "Index", cagr3y: 15.2, aum: 11200, risk: "High" },
  { id: 4, name: "SBI Equity Hybrid Fund Direct Growth", category: "Hybrid", cagr3y: 14.8, aum: 65000, risk: "High" },
];

export default function MutualFundsPage() {
  const [activeCategory, setActiveCategory] = useState("Equity");

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <PieChart className="text-accent" size={28} />
              </div>
              Mutual Funds & SIP Planner
            </h1>
            <p className="text-foreground-secondary text-sm">
              Analyze, compare, and plan your wealth creation journey.
            </p>
          </div>
          <div className="w-full md:w-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={16} />
            <input 
              type="text" 
              placeholder="Search funds by name or AMC..." 
              className="w-full md:w-80 bg-surface-elevated border border-border rounded-md pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        {/* Global Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            title="Nifty 50 (1Y Return)" 
            value="28.4%" 
            trend="up" 
            icon={Activity} 
          />
          <MetricCard 
            title="Avg Small Cap (1Y)" 
            value="45.2%" 
            trend="up" 
            icon={TrendingUp} 
          />
          <MetricCard 
            title="Top Fund Flow" 
            value="Flexi Cap" 
            subtitle="₹4,500 Cr net inflow (Last Month)"
            icon={PieChart} 
          />
          <div className="glass-card p-4 bg-gradient-to-br from-accent/20 to-surface border-accent/20 flex flex-col justify-center">
            <h3 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
              <ShieldCheck size={16} className="text-accent" /> AI Recommendation
            </h3>
            <p className="text-xs text-foreground-secondary leading-relaxed">
              Based on current macro setup, leaning towards <strong className="text-white">Large & Mid Cap Index Funds</strong> offers optimal risk-adjusted returns.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Main Funds List */}
          <div className="xl:col-span-2 glass-card p-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide mb-4">
              {mfCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors whitespace-nowrap ${
                    activeCategory === cat 
                      ? "bg-accent text-white" 
                      : "bg-surface-elevated text-foreground-secondary hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="table-wrapper">
              <table className="data-table">
                <thead className="bg-surface">
                  <tr>
                    <th>Fund Name</th>
                    <th className="text-right">AUM (Cr)</th>
                    <th className="text-right">Risk</th>
                    <th className="text-right">3Y CAGR</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {mockFunds.map(fund => (
                    <tr key={fund.id} className="group cursor-pointer">
                      <td>
                        <p className="font-medium text-white group-hover:text-accent transition-colors">{fund.name}</p>
                        <p className="text-xs text-foreground-muted">{fund.category}</p>
                      </td>
                      <td className="text-right font-numeric text-foreground-secondary">₹{fund.aum.toLocaleString()}</td>
                      <td className="text-right">
                        <span className="text-xs font-medium px-2 py-1 rounded bg-negative/10 text-negative border border-negative/20">
                          {fund.risk}
                        </span>
                      </td>
                      <td className="text-right font-numeric text-positive font-bold">
                        {fund.cagr3y}%
                      </td>
                      <td className="text-right">
                        <ChevronRight size={16} className="inline-block text-foreground-muted group-hover:text-accent" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="w-full mt-4 py-2 border border-border rounded-md text-sm text-foreground-secondary hover:text-white hover:bg-surface-elevated transition-colors">
              View All {activeCategory} Funds
            </button>
          </div>

          {/* SIP Goal Tracker Sidebar */}
          <div className="space-y-6">
            <div className="glass-card p-6 border-t-4 border-t-positive">
              <h2 className="text-lg font-semibold text-white mb-4">SIP Goal Tracker</h2>
              
              <div className="space-y-4">
                <div className="bg-surface-elevated p-4 rounded-lg border border-border">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-white">Retirement Corpus</h3>
                    <span className="text-xs text-positive bg-positive/10 px-2 py-1 rounded">On Track</span>
                  </div>
                  <div className="flex justify-between text-xs text-foreground-muted mb-2">
                    <span>Target: ₹5 Cr</span>
                    <span>Achieved: ₹1.2 Cr (24%)</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2 overflow-hidden border border-border/50">
                    <div className="bg-positive h-full rounded-full" style={{ width: '24%' }}></div>
                  </div>
                </div>

                <div className="bg-surface-elevated p-4 rounded-lg border border-border">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-white">House Down Payment</h3>
                    <span className="text-xs text-warning bg-warning/10 px-2 py-1 rounded">Action Needed</span>
                  </div>
                  <div className="flex justify-between text-xs text-foreground-muted mb-2">
                    <span>Target: ₹50 L</span>
                    <span>Achieved: ₹35 L (70%)</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2 overflow-hidden border border-border/50">
                    <div className="bg-warning h-full rounded-full" style={{ width: '70%' }}></div>
                  </div>
                  <p className="text-xs text-warning mt-3">Increase SIP by ₹5,000/mo to hit 2025 goal.</p>
                </div>
              </div>
              
              <button className="w-full mt-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-md text-sm font-medium transition-colors">
                Add New Goal
              </button>
            </div>

            {/* Quick Tools */}
            <div className="glass-card p-6">
              <h2 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Quick Tools</h2>
              <div className="space-y-2">
                {["SIP Calculator", "Lumpsum vs SIP", "Portfolio Overlap", "Expense Ratio Comparator"].map(tool => (
                  <button key={tool} className="w-full text-left px-4 py-3 bg-surface-elevated hover:bg-surface-hover border border-border rounded-lg text-sm text-foreground-secondary hover:text-white transition-colors flex justify-between items-center">
                    {tool}
                    <ChevronRight size={14} />
                  </button>
                ))}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </PageWrapper>
  );
}
