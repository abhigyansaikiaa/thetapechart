"use client";

import { CalendarDays, AlertTriangle, TrendingUp, TrendingDown, Clock, Globe } from "lucide-react";

const calendarEvents = [
  { id: 1, time: "08:30 AM", country: "US", event: "Core CPI (MoM) (May)", impact: "High", actual: "0.2%", forecast: "0.3%", previous: "0.3%" },
  { id: 2, time: "08:30 AM", country: "US", event: "CPI (YoY) (May)", impact: "High", actual: "3.3%", forecast: "3.4%", previous: "3.4%" },
  { id: 3, time: "10:30 AM", country: "US", event: "Crude Oil Inventories", impact: "Medium", actual: "3.730M", forecast: "-1.550M", previous: "1.233M" },
  { id: 4, time: "02:00 PM", country: "US", event: "FOMC Economic Projections", impact: "High", actual: "", forecast: "", previous: "" },
  { id: 5, time: "02:00 PM", country: "US", event: "Fed Interest Rate Decision", impact: "High", actual: "", forecast: "5.50%", previous: "5.50%" },
  { id: 6, time: "02:30 PM", country: "US", event: "FOMC Press Conference", impact: "High", actual: "", forecast: "", previous: "" },
];

export default function EconomicCalendarPage() {
  return (
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <CalendarDays className="text-accent" /> Economic Calendar
          </h1>
          <p className="text-foreground-secondary mt-1">
            Track high-impact macroeconomic events and Federal Reserve announcements.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#111113] border border-border px-4 py-2 rounded-lg text-sm text-foreground-muted font-bold">
          <Clock size={16} /> Timezone: EST (New York)
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl p-5 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-white flex items-center gap-2">
            <Globe size={16} className="text-accent" /> Today's Major Events
          </h3>
          <div className="flex gap-2">
            <span className="flex items-center gap-1 text-xs text-negative font-bold px-2 py-1 bg-negative/10 rounded"><AlertTriangle size={12}/> High Impact</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-foreground-muted">
                <th className="pb-3 font-bold uppercase tracking-wider text-xs">Time</th>
                <th className="pb-3 font-bold uppercase tracking-wider text-xs">Country</th>
                <th className="pb-3 font-bold uppercase tracking-wider text-xs">Impact</th>
                <th className="pb-3 font-bold uppercase tracking-wider text-xs">Event</th>
                <th className="pb-3 font-bold uppercase tracking-wider text-xs text-right">Actual</th>
                <th className="pb-3 font-bold uppercase tracking-wider text-xs text-right">Forecast</th>
                <th className="pb-3 font-bold uppercase tracking-wider text-xs text-right">Previous</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {calendarEvents.map((evt) => (
                <tr key={evt.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 font-mono text-foreground-secondary whitespace-nowrap">{evt.time}</td>
                  <td className="py-4 font-bold text-white">{evt.country}</td>
                  <td className="py-4">
                    {evt.impact === "High" ? (
                      <span className="text-negative flex items-center gap-1"><AlertTriangle size={14}/> High</span>
                    ) : (
                      <span className="text-yellow-500">Medium</span>
                    )}
                  </td>
                  <td className="py-4 font-medium text-white">{evt.event}</td>
                  
                  {/* Actual vs Forecast coloring logic */}
                  <td className="py-4 font-mono text-right font-bold whitespace-nowrap">
                    {evt.actual ? (
                      <span className={
                        parseFloat(evt.actual) > parseFloat(evt.forecast || evt.previous) ? "text-positive" : 
                        parseFloat(evt.actual) < parseFloat(evt.forecast || evt.previous) ? "text-negative" : "text-white"
                      }>
                        {evt.actual}
                      </span>
                    ) : <span className="text-foreground-muted">-</span>}
                  </td>
                  
                  <td className="py-4 font-mono text-foreground-secondary text-right whitespace-nowrap">{evt.forecast || "-"}</td>
                  <td className="py-4 font-mono text-foreground-secondary text-right whitespace-nowrap">{evt.previous || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Fed Watch Tool Widget Simulation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface border border-border rounded-xl p-6">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-accent" /> Target Rate Probabilities
          </h3>
          <p className="text-sm text-foreground-muted mb-6">Upcoming FOMC Meeting: July 31, 2026</p>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white font-bold">525 - 550 bps (Unchanged)</span>
                <span className="text-accent font-mono font-bold">88.4%</span>
              </div>
              <div className="w-full bg-[#111113] h-3 rounded-full overflow-hidden">
                <div className="bg-accent h-full" style={{ width: '88.4%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white font-bold">500 - 525 bps (Cut)</span>
                <span className="text-positive font-mono font-bold">11.6%</span>
              </div>
              <div className="w-full bg-[#111113] h-3 rounded-full overflow-hidden">
                <div className="bg-positive h-full" style={{ width: '11.6%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
