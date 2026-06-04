import { Play, TrendingUp, TrendingDown, Settings2, Activity, Database, LineChart } from "lucide-react";

export default function BacktesterPage() {
  return (
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <Settings2 className="text-accent" /> Algorithmic Backtester
          </h1>
          <p className="text-foreground-secondary mt-1">
            Simulate quantitative strategies on historical market data.
          </p>
        </div>
        <button className="bg-accent hover:bg-accent/90 text-black font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors">
          <Play size={16} /> Run Backtest
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Panel */}
        <div className="col-span-1 space-y-6">
          <div className="bg-surface border border-border rounded-xl p-5">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <Database size={16} className="text-accent" /> Strategy Parameters
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-foreground-muted uppercase tracking-wider mb-1 block">Strategy Type</label>
                <select className="w-full bg-[#111113] border border-border rounded-lg p-2 text-sm text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none">
                  <option>SMC Fair Value Gap (FVG)</option>
                  <option>EMA Crossover (9/21)</option>
                  <option>RSI Mean Reversion</option>
                  <option>MACD Divergence</option>
                  <option>VWAP Bounce</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground-muted uppercase tracking-wider mb-1 block">Ticker Symbol</label>
                <input type="text" placeholder="AAPL, TSLA, BTC-USD..." className="w-full bg-[#111113] border border-border rounded-lg p-2 text-sm text-white focus:border-accent outline-none font-mono" defaultValue="NQ=F" />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground-muted uppercase tracking-wider mb-1 block">Timeframe</label>
                <select className="w-full bg-[#111113] border border-border rounded-lg p-2 text-sm text-white focus:border-accent outline-none">
                  <option>1 Minute</option>
                  <option>5 Minute</option>
                  <option>15 Minute</option>
                  <option>1 Hour</option>
                  <option>Daily</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground-muted uppercase tracking-wider mb-1 block">Initial Capital</label>
                <input type="text" className="w-full bg-[#111113] border border-border rounded-lg p-2 text-sm text-white font-mono focus:border-accent outline-none" defaultValue="$10,000.00" />
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-xl p-5">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <Activity size={16} className="text-accent" /> Risk Constraints
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-foreground-muted uppercase tracking-wider mb-1 block">Max Risk Per Trade</label>
                <div className="flex items-center gap-2">
                  <input type="range" min="1" max="10" defaultValue="2" className="flex-1 accent-accent" />
                  <span className="text-sm font-mono text-white">2%</span>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-foreground-muted uppercase tracking-wider mb-1 block">Target R:R Ratio</label>
                <input type="text" className="w-full bg-[#111113] border border-border rounded-lg p-2 text-sm text-white font-mono focus:border-accent outline-none" defaultValue="1:3" />
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="col-span-1 lg:col-span-3 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-surface border border-border rounded-xl p-4 flex flex-col justify-center">
              <p className="text-xs text-foreground-muted font-bold uppercase tracking-wider mb-1">Net Profit</p>
              <p className="text-2xl font-bold text-positive font-mono">+$4,250.00</p>
              <p className="text-xs text-positive mt-1 flex items-center gap-1"><TrendingUp size={12} /> +42.50%</p>
            </div>
            <div className="bg-surface border border-border rounded-xl p-4 flex flex-col justify-center">
              <p className="text-xs text-foreground-muted font-bold uppercase tracking-wider mb-1">Win Rate</p>
              <p className="text-2xl font-bold text-white font-mono">68.4%</p>
              <p className="text-xs text-foreground-secondary mt-1">Based on 124 trades</p>
            </div>
            <div className="bg-surface border border-border rounded-xl p-4 flex flex-col justify-center">
              <p className="text-xs text-foreground-muted font-bold uppercase tracking-wider mb-1">Profit Factor</p>
              <p className="text-2xl font-bold text-white font-mono">2.41</p>
              <p className="text-xs text-foreground-secondary mt-1">Gross Win / Gross Loss</p>
            </div>
            <div className="bg-surface border border-border rounded-xl p-4 flex flex-col justify-center">
              <p className="text-xs text-foreground-muted font-bold uppercase tracking-wider mb-1">Max Drawdown</p>
              <p className="text-2xl font-bold text-negative font-mono">-8.2%</p>
              <p className="text-xs text-negative mt-1 flex items-center gap-1"><TrendingDown size={12} /> High Resilience</p>
            </div>
          </div>

          {/* Equity Curve Mock */}
          <div className="bg-surface border border-border rounded-xl p-6 h-[400px] flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-center mb-6 z-10">
              <h3 className="font-bold text-white flex items-center gap-2">
                <LineChart size={16} className="text-accent" /> Equity Curve
              </h3>
              <div className="flex gap-2">
                <span className="text-xs font-mono bg-[#111113] border border-border px-2 py-1 rounded text-white">YTD</span>
                <span className="text-xs font-mono bg-[#111113] border border-border px-2 py-1 rounded text-foreground-muted">1Y</span>
              </div>
            </div>
            
            {/* Mock Chart Area */}
            <div className="flex-1 border border-border/50 rounded-lg relative overflow-hidden bg-[#111113]">
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
                backgroundImage: 'linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }} />
              
              {/* Fake SVG Equity Line */}
              <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 1000 400">
                <defs>
                  <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path 
                  d="M0,350 Q50,340 100,360 T200,320 T300,250 T400,280 T500,200 T600,150 T700,180 T800,100 T900,120 T1000,50 L1000,400 L0,400 Z" 
                  fill="url(#equityGrad)" 
                />
                <path 
                  d="M0,350 Q50,340 100,360 T200,320 T300,250 T400,280 T500,200 T600,150 T700,180 T800,100 T900,120 T1000,50" 
                  fill="none" 
                  stroke="#22c55e" 
                  strokeWidth="3" 
                  className="drop-shadow-lg"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
