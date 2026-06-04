"use client";

import { MarketEvent } from "@/lib/dashboardData";

interface EventsTimelineProps {
  events: MarketEvent[];
}

export function EventsTimeline({ events }: EventsTimelineProps) {
  return (
    <div className="mt-2">
      <h3 className="text-[10px] font-bold text-foreground-secondary mb-3 tracking-widest uppercase">
        Upcoming Events
      </h3>
      
      <div className="space-y-0 relative">
        {/* Timeline connecting line */}
        <div className="absolute left-[2.5px] top-2 bottom-4 w-px bg-border/50" />
        
        {events.map((ev, i) => {
          const isHighImpact = ev.impact === "high";
          const dotColor = isHighImpact ? "bg-negative" : "bg-warning";
          const glowColor = isHighImpact ? "shadow-[0_0_8px_rgba(239,68,68,0.6)]" : "shadow-[0_0_8px_rgba(245,158,11,0.6)]";
          
          return (
            <div
              key={i}
              className={`flex gap-3 py-2.5 relative group ${
                i < events.length - 1 ? "border-b border-border/40" : ""
              }`}
            >
              {/* Timeline Dot */}
              <div className="relative z-10 flex-shrink-0 mt-1.5">
                <div 
                  className={`w-1.5 h-1.5 rounded-full ${dotColor} ${glowColor} group-hover:scale-150 transition-transform`} 
                />
              </div>
              
              <div>
                <div className="text-[10px] text-foreground-muted font-semibold tracking-wide">
                  {ev.date}
                </div>
                <div className="text-[12px] text-foreground-secondary group-hover:text-white transition-colors">
                  {ev.event}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
