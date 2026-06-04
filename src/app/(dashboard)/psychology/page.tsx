import { BrainCircuit, HeartPulse, Shield, Zap, TrendingUp, AlertOctagon } from "lucide-react";

export default function PsychologyPage() {
  return (
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <BrainCircuit className="text-accent" /> Trading Psychology Hub
          </h1>
          <p className="text-foreground-secondary mt-1">
            Master your emotions, track your mindset, and build unbreakable discipline.
          </p>
        </div>
        <button className="bg-accent hover:bg-accent/90 text-black font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors">
          <HeartPulse size={16} /> Log Pre-Trade Emotion
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface border border-border rounded-xl p-6">
          <div className="w-12 h-12 bg-positive/10 text-positive rounded-full flex items-center justify-center mb-4">
            <Shield size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Discipline Score</h3>
          <p className="text-4xl font-bold font-mono text-positive mb-2">92/100</p>
          <p className="text-sm text-foreground-muted">You followed your trading plan on 11 out of 12 trades this week. Excellent self-control.</p>
        </div>
        
        <div className="bg-surface border border-border rounded-xl p-6">
          <div className="w-12 h-12 bg-negative/10 text-negative rounded-full flex items-center justify-center mb-4">
            <AlertOctagon size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">FOMO Index</h3>
          <p className="text-4xl font-bold font-mono text-negative mb-2">High</p>
          <p className="text-sm text-foreground-muted">You chased 3 trades after massive price runs. AI suggests stepping away for 2 hours.</p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-6">
          <div className="w-12 h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center mb-4">
            <Zap size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Peak Performance</h3>
          <p className="text-4xl font-bold font-mono text-white mb-2">9:30 - 11:00 AM</p>
          <p className="text-sm text-foreground-muted">Your highest win rate (78%) occurs in the first 90 minutes of the market open.</p>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6">
        <h3 className="font-bold text-white mb-6 flex items-center gap-2">
          <TrendingUp className="text-accent" /> Win Rate vs Emotion
        </h3>
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center gap-4">
            <span className="w-24 text-sm font-bold text-white">Calm & Focused</span>
            <div className="flex-1 bg-[#111113] h-4 rounded-full overflow-hidden">
              <div className="bg-positive h-full" style={{width: '82%'}}></div>
            </div>
            <span className="w-12 text-sm font-mono text-positive text-right">82%</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="w-24 text-sm font-bold text-white">Anxious / FOMO</span>
            <div className="flex-1 bg-[#111113] h-4 rounded-full overflow-hidden">
              <div className="bg-negative h-full" style={{width: '34%'}}></div>
            </div>
            <span className="w-12 text-sm font-mono text-negative text-right">34%</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="w-24 text-sm font-bold text-white">Revenge Trading</span>
            <div className="flex-1 bg-[#111113] h-4 rounded-full overflow-hidden">
              <div className="bg-red-600 h-full" style={{width: '12%'}}></div>
            </div>
            <span className="w-12 text-sm font-mono text-red-600 text-right">12%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
