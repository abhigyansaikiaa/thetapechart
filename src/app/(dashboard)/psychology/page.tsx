"use client";

import { useState, useEffect } from "react";
import { BrainCircuit, HeartPulse, Shield, Zap, TrendingUp, AlertOctagon, X, Plus } from "lucide-react";

interface TradeLog {
  id: string;
  date: string;
  result: "WIN" | "LOSS";
  emotion: string;
  pnl: number;
}

export default function PsychologyPage() {
  const [logs, setLogs] = useState<TradeLog[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [result, setResult] = useState<"WIN" | "LOSS">("WIN");
  const [emotion, setEmotion] = useState("Calm");
  const [pnl, setPnl] = useState("");

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("psychology_logs");
    if (saved) {
      setLogs(JSON.parse(saved));
    }
  }, []);

  const saveLog = () => {
    if (!pnl) return;
    
    const newLog: TradeLog = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleDateString(),
      result,
      emotion,
      pnl: parseFloat(pnl)
    };

    const updated = [newLog, ...logs];
    setLogs(updated);
    localStorage.setItem("psychology_logs", JSON.stringify(updated));
    
    setShowModal(false);
    setPnl("");
    setEmotion("Calm");
  };

  const clearLogs = () => {
    if (confirm("Are you sure you want to clear your psychological data?")) {
      setLogs([]);
      localStorage.removeItem("psychology_logs");
    }
  };

  // Compute Analytics
  const totalTrades = logs.length;
  const wins = logs.filter(l => l.result === "WIN").length;
  const globalWinRate = totalTrades > 0 ? Math.round((wins / totalTrades) * 100) : 0;

  const emotionsList = ["Calm", "Anxious", "FOMO", "Revenge", "Overconfident"];
  
  const getEmotionStats = (targetEmotion: string) => {
    const emotionTrades = logs.filter(l => l.emotion === targetEmotion);
    const emotionWins = emotionTrades.filter(l => l.result === "WIN").length;
    return {
      count: emotionTrades.length,
      winRate: emotionTrades.length > 0 ? Math.round((emotionWins / emotionTrades.length) * 100) : 0
    };
  };

  const calmStats = getEmotionStats("Calm");
  const fomoStats = getEmotionStats("FOMO");
  const revengeStats = getEmotionStats("Revenge");

  // Determine Discipline Score
  let disciplineScore = 100;
  if (totalTrades > 0) {
    const negativeEmotions = logs.filter(l => ["FOMO", "Revenge", "Anxious"].includes(l.emotion)).length;
    disciplineScore = Math.max(0, 100 - Math.round((negativeEmotions / totalTrades) * 100));
  } else {
    disciplineScore = 0;
  }

  // Determine FOMO Index
  let fomoIndex = "Low";
  if (fomoStats.count > 0) {
    const fomoRatio = fomoStats.count / totalTrades;
    if (fomoRatio > 0.4) fomoIndex = "Extreme";
    else if (fomoRatio > 0.2) fomoIndex = "High";
    else if (fomoRatio > 0.1) fomoIndex = "Medium";
  }

  return (
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <BrainCircuit className="text-accent" /> Trading Psychology Hub
          </h1>
          <p className="text-foreground-secondary mt-1">
            Master your emotions, track your mindset, and build unbreakable discipline using real data.
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={clearLogs} className="bg-transparent border border-border text-foreground-muted px-4 py-2.5 rounded-lg text-sm hover:text-white transition-colors">
            Clear Data
          </button>
          <button onClick={() => setShowModal(true)} className="bg-accent hover:bg-accent/90 text-black font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors">
            <HeartPulse size={16} /> Log Pre-Trade Emotion
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface border border-border rounded-xl p-6">
          <div className="w-12 h-12 bg-positive/10 text-positive rounded-full flex items-center justify-center mb-4">
            <Shield size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Discipline Score</h3>
          <p className="text-4xl font-bold font-mono text-positive mb-2">{disciplineScore}/100</p>
          <p className="text-sm text-foreground-muted">
            {totalTrades === 0 ? "Log trades to calculate." : `Based on your emotional state across ${totalTrades} trades.`}
          </p>
        </div>
        
        <div className="bg-surface border border-border rounded-xl p-6">
          <div className="w-12 h-12 bg-negative/10 text-negative rounded-full flex items-center justify-center mb-4">
            <AlertOctagon size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">FOMO Index</h3>
          <p className="text-4xl font-bold font-mono text-negative mb-2">{fomoIndex}</p>
          <p className="text-sm text-foreground-muted">
            {totalTrades === 0 ? "Log trades to calculate." : `You have chased ${fomoStats.count} trades.`}
          </p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-6">
          <div className="w-12 h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center mb-4">
            <Zap size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Global Win Rate</h3>
          <p className="text-4xl font-bold font-mono text-white mb-2">{globalWinRate}%</p>
          <p className="text-sm text-foreground-muted">
            {totalTrades === 0 ? "Log trades to calculate." : `${wins} wins out of ${totalTrades} total logged trades.`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface border border-border rounded-xl p-6">
          <h3 className="font-bold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="text-accent" /> Win Rate vs Emotion (Real Data)
          </h3>
          <div className="space-y-6 max-w-2xl">
            
            <div className="flex items-center gap-4">
              <span className="w-24 text-sm font-bold text-white">Calm ({calmStats.count})</span>
              <div className="flex-1 bg-[#111113] h-4 rounded-full overflow-hidden border border-border/50">
                <div className="bg-positive h-full transition-all duration-1000" style={{width: `${calmStats.count > 0 ? calmStats.winRate : 0}%`}}></div>
              </div>
              <span className="w-12 text-sm font-mono text-positive text-right">{calmStats.winRate}%</span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="w-24 text-sm font-bold text-white">FOMO ({fomoStats.count})</span>
              <div className="flex-1 bg-[#111113] h-4 rounded-full overflow-hidden border border-border/50">
                <div className="bg-negative h-full transition-all duration-1000" style={{width: `${fomoStats.count > 0 ? fomoStats.winRate : 0}%`}}></div>
              </div>
              <span className="w-12 text-sm font-mono text-negative text-right">{fomoStats.winRate}%</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="w-24 text-sm font-bold text-white">Revenge ({revengeStats.count})</span>
              <div className="flex-1 bg-[#111113] h-4 rounded-full overflow-hidden border border-border/50">
                <div className="bg-red-600 h-full transition-all duration-1000" style={{width: `${revengeStats.count > 0 ? revengeStats.winRate : 0}%`}}></div>
              </div>
              <span className="w-12 text-sm font-mono text-red-600 text-right">{revengeStats.winRate}%</span>
            </div>

          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-6 overflow-y-auto max-h-[400px]">
          <h3 className="font-bold text-white mb-4">Recent Psychology Logs</h3>
          {logs.length === 0 ? (
            <p className="text-sm text-foreground-muted italic">No logs found. Add one to see data.</p>
          ) : (
            <div className="space-y-3">
              {logs.map(log => (
                <div key={log.id} className="flex justify-between items-center bg-[#111113] border border-border p-3 rounded-lg">
                  <div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-md mr-2 ${log.result === 'WIN' ? 'bg-positive/20 text-positive' : 'bg-negative/20 text-negative'}`}>
                      {log.result}
                    </span>
                    <span className="text-sm font-medium text-white">{log.emotion}</span>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-mono font-bold ${log.result === 'WIN' ? 'text-positive' : 'text-negative'}`}>
                      {log.result === 'WIN' ? '+' : '-'}${Math.abs(log.pnl).toFixed(2)}
                    </p>
                    <p className="text-[10px] text-foreground-muted">{log.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Logging Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-4 border-b border-border">
              <h3 className="font-bold text-white text-lg">Log Trade & Emotion</h3>
              <button onClick={() => setShowModal(false)} className="text-foreground-muted hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="text-xs font-bold text-foreground-muted uppercase tracking-wider mb-2 block">Trade Result</label>
                <div className="flex gap-2">
                  <button onClick={() => setResult("WIN")} className={`flex-1 py-2 rounded-lg font-bold border transition-colors ${result === 'WIN' ? 'bg-positive/20 border-positive text-positive' : 'bg-[#111113] border-border text-foreground-muted'}`}>WIN</button>
                  <button onClick={() => setResult("LOSS")} className={`flex-1 py-2 rounded-lg font-bold border transition-colors ${result === 'LOSS' ? 'bg-negative/20 border-negative text-negative' : 'bg-[#111113] border-border text-foreground-muted'}`}>LOSS</button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground-muted uppercase tracking-wider mb-2 block">Pre-Trade Emotion</label>
                <select value={emotion} onChange={(e) => setEmotion(e.target.value)} className="w-full bg-[#111113] border border-border rounded-lg p-3 text-sm text-white focus:border-accent outline-none">
                  {emotionsList.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground-muted uppercase tracking-wider mb-2 block">Net PnL ($)</label>
                <input type="number" value={pnl} onChange={(e) => setPnl(e.target.value)} placeholder="e.g. 150.50" className="w-full bg-[#111113] border border-border rounded-lg p-3 text-sm text-white focus:border-accent outline-none font-mono" />
              </div>
            </div>

            <div className="p-4 border-t border-border bg-surface-elevated">
              <button onClick={saveLog} disabled={!pnl} className="w-full bg-accent hover:bg-accent/90 text-black font-bold py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                <Plus size={18} /> Save Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
