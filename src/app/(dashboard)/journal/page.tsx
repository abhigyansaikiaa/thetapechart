"use client";

import { useTradingStore } from "@/lib/store/tradingStore";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";

export default function JournalPage() {
  const { trades, balance } = useTradingStore();
  
  const closedTrades = trades.filter(t => t.status === "Closed");
  const winTrades = closedTrades.filter(t => (t.pnl || 0) > 0);
  const loseTrades = closedTrades.filter(t => (t.pnl || 0) <= 0);

  const winRate = closedTrades.length > 0 ? (winTrades.length / closedTrades.length) * 100 : 0;
  
  const grossProfit = winTrades.reduce((acc, t) => acc + (t.pnl || 0), 0);
  const grossLoss = Math.abs(loseTrades.reduce((acc, t) => acc + (t.pnl || 0), 0));
  const profitFactor = grossLoss > 0 ? (grossProfit / grossLoss) : grossProfit > 0 ? 99 : 0;

  // Generate Equity Curve
  let currentEquity = 100000; // Starting balance
  const equityCurve = closedTrades.map(t => {
    currentEquity += (t.pnl || 0);
    return {
      time: format(new Date(t.closedAt!), "MMM dd HH:mm"),
      equity: currentEquity
    };
  });

  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Quantitative Statistics</h1>
        <p className="text-foreground-secondary">Deep analysis of your automated and manual paper trading performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-[#0A0A0B] border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-foreground-muted uppercase tracking-wider">Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold font-mono ${winRate > 50 ? 'text-positive' : 'text-negative'}`}>
              {winRate.toFixed(1)}%
            </div>
            <p className="text-xs text-foreground-secondary mt-1">{winTrades.length} W / {loseTrades.length} L</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0A0A0B] border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-foreground-muted uppercase tracking-wider">Profit Factor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold font-mono ${profitFactor >= 1 ? 'text-positive' : 'text-negative'}`}>
              {profitFactor.toFixed(2)}
            </div>
            <p className="text-xs text-foreground-secondary mt-1">Gross Profit / Gross Loss</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0A0A0B] border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-foreground-muted uppercase tracking-wider">Total PnL</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold font-mono ${(balance - 100000) >= 0 ? 'text-positive' : 'text-negative'}`}>
              ${(balance - 100000).toFixed(2)}
            </div>
            <p className="text-xs text-foreground-secondary mt-1">Net simulated profit</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0A0A0B] border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-foreground-muted uppercase tracking-wider">Total Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono text-white">
              {closedTrades.length}
            </div>
            <p className="text-xs text-foreground-secondary mt-1">Closed positions</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="col-span-2 bg-[#0A0A0B] border-border">
          <CardHeader>
            <CardTitle>Equity Curve</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            {equityCurve.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={equityCurve}>
                  <defs>
                    <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#52525B" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis domain={['auto', 'auto']} stroke="#52525B" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111113', borderColor: '#27272A', borderRadius: '8px' }}
                    itemStyle={{ color: '#E4E4E7' }}
                  />
                  <Area type="monotone" dataKey="equity" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#colorEquity)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-foreground-muted">No closed trades yet to plot equity curve.</div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-[#0A0A0B] border-border overflow-hidden flex flex-col">
          <CardHeader>
            <CardTitle>Trade Ledger</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-0">
             <div className="divide-y divide-border">
               {closedTrades.slice().reverse().map(trade => (
                 <div key={trade.id} className="p-4 flex justify-between items-center hover:bg-surface transition-colors">
                   <div>
                     <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${trade.direction === 'Long' ? 'bg-positive/20 text-positive' : 'bg-negative/20 text-negative'}`}>{trade.direction}</span>
                        <span className="font-bold text-sm text-white">{trade.symbol}</span>
                     </div>
                     <p className="text-xs text-foreground-muted font-mono">{format(new Date(trade.closedAt!), "MMM dd, HH:mm")}</p>
                   </div>
                   <div className="text-right">
                     <div className={`font-mono font-bold text-sm ${(trade.pnl || 0) >= 0 ? 'text-positive' : 'text-negative'}`}>
                       {(trade.pnl || 0) >= 0 ? '+' : ''}${(trade.pnl || 0).toFixed(2)}
                     </div>
                     <p className="text-xs text-foreground-secondary font-mono mt-0.5">Exit: {trade.exitPrice}</p>
                   </div>
                 </div>
               ))}
               {closedTrades.length === 0 && (
                 <div className="p-8 text-center text-foreground-muted text-sm">No trades executed yet.</div>
               )}
             </div>
          </CardContent>
        </Card>
      </div>

    </PageWrapper>
  );
}
