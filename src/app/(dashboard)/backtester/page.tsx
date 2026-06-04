"use client";

import { useState } from "react";
import { Play, TrendingUp, TrendingDown, Settings2, Activity, Database, LineChart, AlertCircle } from "lucide-react";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function BacktesterPage() {
  const [symbol, setSymbol] = useState("AAPL");
  const [strategy, setStrategy] = useState("EMA Crossover (9/21)");
  const [capital, setCapital] = useState(10000);
  
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");
  
  const [results, setResults] = useState<{
    netProfit: number;
    winRate: number;
    profitFactor: number;
    maxDrawdown: number;
    equityCurve: any[];
    totalTrades: number;
  } | null>(null);

  const runBacktest = async () => {
    setIsRunning(true);
    setError("");
    setResults(null);

    try {
      const res = await fetch(`/api/proxy/yahoo?symbol=${symbol}&range=1y&interval=1d`);
      if (!res.ok) throw new Error("Failed to fetch historical data.");
      
      const data = await res.json();
      const result = data.chart.result[0];
      const timestamps = result.timestamp;
      const closes = result.indicators.quote[0].close;

      if (!timestamps || !closes) throw new Error("Invalid market data received.");

      // Calculate EMA 9 and 21
      const ema9 = calculateEMA(closes, 9);
      const ema21 = calculateEMA(closes, 21);

      let currentCapital = capital;
      let peakCapital = capital;
      let maxDrawdown = 0;
      
      let inPosition = false;
      let entryPrice = 0;
      let wins = 0;
      let losses = 0;
      let grossProfit = 0;
      let grossLoss = 0;

      const equityCurve = [];

      for (let i = 21; i < closes.length; i++) {
        const date = new Date(timestamps[i] * 1000).toLocaleDateString();
        const price = closes[i];
        
        if (!price) continue;

        // EMA Crossover Logic
        const crossoverBullish = ema9[i] > ema21[i] && ema9[i - 1] <= ema21[i - 1];
        const crossoverBearish = ema9[i] < ema21[i] && ema9[i - 1] >= ema21[i - 1];

        if (!inPosition && crossoverBullish) {
          inPosition = true;
          entryPrice = price;
        } else if (inPosition && crossoverBearish) {
          inPosition = false;
          const pnl = ((price - entryPrice) / entryPrice) * currentCapital;
          currentCapital += pnl;

          if (pnl > 0) {
            wins++;
            grossProfit += pnl;
          } else {
            losses++;
            grossLoss += Math.abs(pnl);
          }
        }

        if (currentCapital > peakCapital) peakCapital = currentCapital;
        const currentDrawdown = ((peakCapital - currentCapital) / peakCapital) * 100;
        if (currentDrawdown > maxDrawdown) maxDrawdown = currentDrawdown;

        equityCurve.push({ date, equity: currentCapital });
      }

      // Close open position at end
      if (inPosition) {
        const finalPrice = closes[closes.length - 1];
        const pnl = ((finalPrice - entryPrice) / entryPrice) * currentCapital;
        currentCapital += pnl;
        if (pnl > 0) { wins++; grossProfit += pnl; } 
        else { losses++; grossLoss += Math.abs(pnl); }
        equityCurve[equityCurve.length - 1].equity = currentCapital;
      }

      const totalTrades = wins + losses;
      const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;
      const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : (grossProfit > 0 ? 99 : 0);
      const netProfit = currentCapital - capital;

      setResults({
        netProfit,
        winRate,
        profitFactor,
        maxDrawdown,
        equityCurve,
        totalTrades
      });

    } catch (err: any) {
      setError(err.message || "Failed to run backtest.");
    } finally {
      setIsRunning(false);
    }
  };

  const calculateEMA = (data: number[], period: number) => {
    const k = 2 / (period + 1);
    const ema = [data[0]];
    for (let i = 1; i < data.length; i++) {
      if (data[i] === null) {
        ema.push(ema[i-1]);
        continue;
      }
      ema.push(data[i] * k + ema[i - 1] * (1 - k));
    }
    return ema;
  };

  return (
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <Settings2 className="text-accent" /> Algorithmic Backtester
          </h1>
          <p className="text-foreground-secondary mt-1">
            Simulate quantitative strategies on real historical market data.
          </p>
        </div>
        <button 
          onClick={runBacktest}
          disabled={isRunning}
          className="bg-accent hover:bg-accent/90 text-black font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          {isRunning ? <span className="animate-spin">⚡</span> : <Play size={16} />} 
          {isRunning ? "Running..." : "Run Backtest"}
        </button>
      </div>

      {error && (
        <div className="bg-negative/10 border border-negative/20 text-negative p-4 rounded-lg flex items-center gap-2 font-bold">
          <AlertCircle size={20} /> {error}
        </div>
      )}

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
                <select 
                  value={strategy}
                  onChange={(e) => setStrategy(e.target.value)}
                  className="w-full bg-[#111113] border border-border rounded-lg p-2 text-sm text-white focus:border-accent outline-none"
                >
                  <option>EMA Crossover (9/21)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground-muted uppercase tracking-wider mb-1 block">Ticker Symbol</label>
                <input 
                  type="text" 
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  className="w-full bg-[#111113] border border-border rounded-lg p-2 text-sm text-white focus:border-accent outline-none font-mono" 
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground-muted uppercase tracking-wider mb-1 block">Timeframe</label>
                <select className="w-full bg-[#111113] border border-border rounded-lg p-2 text-sm text-foreground-muted outline-none" disabled>
                  <option>1 Year (Daily)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground-muted uppercase tracking-wider mb-1 block">Initial Capital</label>
                <input 
                  type="number" 
                  value={capital}
                  onChange={(e) => setCapital(Number(e.target.value))}
                  className="w-full bg-[#111113] border border-border rounded-lg p-2 text-sm text-white font-mono focus:border-accent outline-none" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="col-span-1 lg:col-span-3 space-y-6">
          {results ? (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-surface border border-border rounded-xl p-4 flex flex-col justify-center">
                  <p className="text-xs text-foreground-muted font-bold uppercase tracking-wider mb-1">Net Profit</p>
                  <p className={`text-2xl font-bold font-mono ${results.netProfit >= 0 ? 'text-positive' : 'text-negative'}`}>
                    {results.netProfit >= 0 ? '+' : ''}{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(results.netProfit)}
                  </p>
                  <p className={`text-xs mt-1 flex items-center gap-1 ${results.netProfit >= 0 ? 'text-positive' : 'text-negative'}`}>
                    {results.netProfit >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {((results.netProfit / capital) * 100).toFixed(2)}%
                  </p>
                </div>
                <div className="bg-surface border border-border rounded-xl p-4 flex flex-col justify-center">
                  <p className="text-xs text-foreground-muted font-bold uppercase tracking-wider mb-1">Win Rate</p>
                  <p className="text-2xl font-bold text-white font-mono">{results.winRate.toFixed(1)}%</p>
                  <p className="text-xs text-foreground-secondary mt-1">Based on {results.totalTrades} trades</p>
                </div>
                <div className="bg-surface border border-border rounded-xl p-4 flex flex-col justify-center">
                  <p className="text-xs text-foreground-muted font-bold uppercase tracking-wider mb-1">Profit Factor</p>
                  <p className="text-2xl font-bold text-white font-mono">{results.profitFactor.toFixed(2)}</p>
                  <p className="text-xs text-foreground-secondary mt-1">Gross Win / Gross Loss</p>
                </div>
                <div className="bg-surface border border-border rounded-xl p-4 flex flex-col justify-center">
                  <p className="text-xs text-foreground-muted font-bold uppercase tracking-wider mb-1">Max Drawdown</p>
                  <p className="text-2xl font-bold text-negative font-mono">-{results.maxDrawdown.toFixed(2)}%</p>
                  <p className="text-xs text-negative mt-1 flex items-center gap-1"><TrendingDown size={12} /> Peak to trough</p>
                </div>
              </div>

              {/* Equity Curve Chart */}
              <div className="bg-surface border border-border rounded-xl p-6 h-[400px] flex flex-col relative overflow-hidden">
                <div className="flex justify-between items-center mb-4 z-10">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <LineChart size={16} className="text-accent" /> Real Equity Curve
                  </h3>
                </div>
                
                <div className="flex-1 w-full -ml-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={results.equityCurve}>
                      <XAxis dataKey="date" stroke="#666" fontSize={10} tickFormatter={(val) => val.slice(0, 5)} />
                      <YAxis stroke="#666" fontSize={10} domain={['auto', 'auto']} tickFormatter={(val) => `$${(val/1000).toFixed(1)}k`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#111113', borderColor: '#333', color: '#fff' }}
                        formatter={(value: any) => [new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0), 'Equity']}
                      />
                      <Line type="monotone" dataKey="equity" stroke="#22c55e" strokeWidth={2} dot={false} />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-surface border border-border rounded-xl h-[500px] flex flex-col items-center justify-center text-foreground-muted">
              <LineChart size={48} className="mb-4 opacity-50" />
              <p className="font-bold text-lg">No Results Yet</p>
              <p className="text-sm">Click "Run Backtest" to simulate the strategy.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
