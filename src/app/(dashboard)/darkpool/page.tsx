import { Eye, ShieldAlert, BarChart3, TrendingDown, TrendingUp, AlertTriangle } from "lucide-react";

export default function DarkPoolPage() {
  const flowData = [
    { id: 1, time: "10:42:15", ticker: "NVDA", type: "SWEEP", premium: "$2.4M", sentiment: "Bullish", detail: "600C EXP 11/15" },
    { id: 2, time: "10:40:02", ticker: "SPY", type: "BLOCK", premium: "$15.1M", sentiment: "Bearish", detail: "490P EXP 10/18" },
    { id: 3, time: "10:35:55", ticker: "TSLA", type: "SWEEP", premium: "$1.8M", sentiment: "Bullish", detail: "250C EXP 10/25" },
    { id: 4, time: "10:22:10", ticker: "QQQ", type: "BLOCK", premium: "$8.5M", sentiment: "Bullish", detail: "Dark Pool Print @ $425.10" },
    { id: 5, time: "10:15:33", ticker: "AAPL", type: "SPLIT", premium: "$3.2M", sentiment: "Bearish", detail: "175P EXP 11/01" },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <Eye className="text-accent" /> Institutional Options Flow
          </h1>
          <p className="text-foreground-secondary mt-1">
            Track smart money movements, dark pool prints, and unusual options activity.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-negative/10 border border-negative/20 text-negative px-4 py-2 rounded-lg font-bold text-sm">
          <AlertTriangle size={16} /> Extreme Put Skew on SPY
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2 space-y-6">
          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-white flex items-center gap-2">
                <BarChart3 size={16} className="text-accent" /> Live Order Flow
              </h3>
              <div className="flex gap-2">
                <button className="text-xs bg-[#111113] border border-border text-white px-3 py-1.5 rounded hover:bg-white/10 transition-colors">Filter Filters</button>
              </div>
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
                  {flowData.map((flow) => (
                    <tr key={flow.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 font-mono text-foreground-secondary">{flow.time}</td>
                      <td className="py-3 font-bold text-white">{flow.ticker}</td>
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
              <ShieldAlert size={16} className="text-accent" /> Dark Pool Heatmap
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm border-b border-border/50 pb-2">
                <span className="font-bold text-white">SPY</span>
                <div className="flex items-center gap-2">
                  <span className="w-24 h-2 bg-negative rounded-full" style={{width: '75%'}}></span>
                  <span className="w-8 h-2 bg-positive rounded-full" style={{width: '25%'}}></span>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-border/50 pb-2">
                <span className="font-bold text-white">QQQ</span>
                <div className="flex items-center gap-2">
                  <span className="w-16 h-2 bg-negative rounded-full" style={{width: '60%'}}></span>
                  <span className="w-16 h-2 bg-positive rounded-full" style={{width: '40%'}}></span>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-border/50 pb-2">
                <span className="font-bold text-white">NVDA</span>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-2 bg-negative rounded-full" style={{width: '10%'}}></span>
                  <span className="w-28 h-2 bg-positive rounded-full" style={{width: '90%'}}></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
