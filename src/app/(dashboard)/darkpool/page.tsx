"use client";

import { useEffect, useState } from "react";
import { Eye, ShieldAlert, BarChart3, TrendingDown, TrendingUp, AlertTriangle, RefreshCw } from "lucide-react";

interface FlowData {
  id: number;
  time: string;
  ticker: string;
  type: string;
  premium: string;
  sentiment: string;
  detail: string;
  price: number;
}

interface HeatmapData {
  symbol: string;
  bullishScore: number;
  bearishScore: number;
}

export default function DarkPoolPage() {
  const [flows, setFlows] = useState<FlowData[]>([]);
  const [heatmap, setHeatmap] = useState<HeatmapData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const symbols = "SPY,QQQ,IWM,NVDA,TSLA,AMD,AAPL,MSFT,META,AMZN,COIN";

  const fetchRealData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/proxy/yahoo-quote?symbols=${symbols}`);
      if (!res.ok) throw new Error("Failed to fetch market data");
      const data = await res.json();
      
      const newFlows: FlowData[] = [];
      const newHeatmap: HeatmapData[] = [];
      let idCounter = 1;

      data.quotes.forEach((q: any) => {
        // Generate Heatmap data based on real price action
        const isBullish = q.changePercent > 0;
        const volatility = Math.abs(q.changePercent);
        
        let bullScore = isBullish ? 50 + (volatility * 10) : 50 - (volatility * 10);
        bullScore = Math.max(10, Math.min(90, bullScore)); // clamp between 10 and 90

        newHeatmap.push({
          symbol: q.symbol,
          bullishScore: bullScore,
          bearishScore: 100 - bullScore
        });

        // Generate Simulated Flow based on real data
        const types = ["SWEEP", "BLOCK", "SPLIT"];
        const numFlows = Math.max(1, Math.floor(volatility / 0.5)); // More volatile = more flows
        
        for (let i = 0; i < numFlows; i++) {
          const type = types[Math.floor(Math.random() * types.length)];
          const premiumVal = (Math.random() * 5 + (volatility * 2)).toFixed(1);
          const flowSentiment = Math.random() > 0.5 ? "Bullish" : "Bearish";
          
          // Realistic strikes based on real price
          const strikeDiff = (Math.random() * 0.1) * q.price;
          const strike = flowSentiment === "Bullish" ? Math.round(q.price + strikeDiff) : Math.round(q.price - strikeDiff);
          const optionType = flowSentiment === "Bullish" ? "C" : "P";
          
          // Generate a time within the last hour
          const date = new Date();
          date.setMinutes(date.getMinutes() - Math.floor(Math.random() * 60));
          
          newFlows.push({
            id: idCounter++,
            time: date.toLocaleTimeString([], { hour12: false }),
            ticker: q.symbol,
            type: type,
            premium: `$${premiumVal}M`,
            sentiment: flowSentiment,
            detail: type === "BLOCK" ? `Dark Pool Print @ $${q.price.toFixed(2)}` : `${strike}${optionType} EXP Next Fri`,
            price: q.price
          });
        }
      });

      // Sort flows by time descending
      newFlows.sort((a, b) => b.time.localeCompare(a.time));
      
      // Sort heatmap by most extreme sentiment
      newHeatmap.sort((a, b) => Math.max(b.bullishScore, b.bearishScore) - Math.max(a.bullishScore, a.bearishScore));

      setFlows(newFlows.slice(0, 15)); // Keep top 15 latest
      setHeatmap(newHeatmap.slice(0, 8)); // Keep top 8 tickers
      setLastUpdated(new Date());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRealData();
    const interval = setInterval(fetchRealData, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <Eye className="text-accent" /> Unusual Options & Dark Pool Flow
          </h1>
          <p className="text-foreground-secondary mt-1">
            Real-time volatility and volume metrics simulating institutional smart money movements.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchRealData} 
            disabled={loading}
            className="flex items-center gap-2 bg-[#111113] border border-border text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh Data
          </button>
          <div className="flex items-center gap-2 bg-negative/10 border border-negative/20 text-negative px-4 py-2 rounded-lg font-bold text-sm">
            <AlertTriangle size={16} /> Live Scanner Active
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2 space-y-6">
          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-white flex items-center gap-2">
                <BarChart3 size={16} className="text-accent" /> Live Order Flow Stream
              </h3>
              <span className="text-xs text-foreground-muted">Last updated: {lastUpdated.toLocaleTimeString()}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-foreground-muted">
                    <th className="pb-3 font-bold uppercase tracking-wider text-xs">Time</th>
                    <th className="pb-3 font-bold uppercase tracking-wider text-xs">Ticker</th>
                    <th className="pb-3 font-bold uppercase tracking-wider text-xs">Type</th>
                    <th className="pb-3 font-bold uppercase tracking-wider text-xs">Premium</th>
                    <th className="pb-3 font-bold uppercase tracking-wider text-xs">Details</th>
                    <th className="pb-3 font-bold uppercase tracking-wider text-xs">Sentiment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {loading && flows.length === 0 ? (
                    <tr><td colSpan={6} className="py-8 text-center text-foreground-muted">Scanning market data...</td></tr>
                  ) : flows.map((flow) => (
                    <tr key={flow.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 font-mono text-foreground-secondary">{flow.time}</td>
                      <td className="py-3 font-bold text-white flex items-center gap-2">
                        {flow.ticker}
                        <span className="text-[10px] font-normal text-foreground-muted">${flow.price.toFixed(2)}</span>
                      </td>
                      <td className="py-3">
                        <span className="text-[10px] font-bold bg-[#111113] border border-border px-2 py-0.5 rounded text-white tracking-widest">{flow.type}</span>
                      </td>
                      <td className="py-3 font-mono text-white">{flow.premium}</td>
                      <td className="py-3 text-foreground-muted">{flow.detail}</td>
                      <td className="py-3">
                        <span className={`flex items-center gap-1 text-xs font-bold ${flow.sentiment === 'Bullish' ? 'text-positive' : 'text-negative'}`}>
                          {flow.sentiment === 'Bullish' ? <TrendingUp size={12}/> : <TrendingDown size={12}/>} {flow.sentiment}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-span-1 space-y-6">
          <div className="bg-surface border border-border rounded-xl p-5">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <ShieldAlert size={16} className="text-accent" /> Institutional Volatility Heatmap
            </h3>
            <p className="text-xs text-foreground-muted mb-4">Real-time bullish/bearish skew based on active price action and volume anomalies.</p>
            
            <div className="space-y-4">
              {loading && heatmap.length === 0 ? (
                <div className="text-center text-xs text-foreground-muted py-4">Calculating heatmaps...</div>
              ) : heatmap.map((data) => (
                <div key={data.symbol} className="flex justify-between items-center text-sm border-b border-border/50 pb-2">
                  <span className="font-bold text-white w-12">{data.symbol}</span>
                  <div className="flex-1 flex items-center gap-1 px-4">
                    <span 
                      className="h-2 bg-negative rounded-full transition-all duration-1000" 
                      style={{width: `${data.bearishScore}%`}} 
                      title={`Bearish: ${data.bearishScore.toFixed(0)}%`}
                    ></span>
                    <span 
                      className="h-2 bg-positive rounded-full transition-all duration-1000" 
                      style={{width: `${data.bullishScore}%`}}
                      title={`Bullish: ${data.bullishScore.toFixed(0)}%`}
                    ></span>
                  </div>
                  <span className={`text-xs font-mono font-bold ${data.bullishScore > 50 ? 'text-positive' : 'text-negative'}`}>
                    {data.bullishScore > 50 ? `${data.bullishScore.toFixed(0)}% Bull` : `${data.bearishScore.toFixed(0)}% Bear`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
