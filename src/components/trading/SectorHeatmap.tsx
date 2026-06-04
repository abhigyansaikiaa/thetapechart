"use client";

import { SectorItem } from "@/lib/dashboardData";
import { motion } from "framer-motion";

interface SectorHeatmapProps {
  sectors: SectorItem[];
}

export function SectorHeatmap({ sectors }: SectorHeatmapProps) {
  return (
    <div className="card p-4 rounded-xl">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-semibold text-white tracking-wide">
          Sector Heatmap
        </h2>
        <span className="text-[10px] text-foreground-muted font-bold px-1.5 py-0.5 rounded border border-border">
          NSE
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-1.5">
        {sectors.map((sec, i) => {
          // Calculate intensity (0.0 to 1.0)
          const intensity = Math.min(Math.abs(sec.change) / 3, 1);
          
          // Generate background color based on direction and intensity
          // Base opacity is 0.08, max opacity is ~0.4
          const bgOpacity = 0.08 + (intensity * 0.32);
          const bg = sec.change >= 0
            ? `rgba(16, 185, 129, ${bgOpacity})`
            : `rgba(239, 68, 68, ${bgOpacity})`;
            
          const clr = sec.change >= 0 ? "#10B981" : "#EF4444";
          
          return (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              key={sec.name}
              className="rounded-lg p-2 text-center transition-transform hover:scale-105 cursor-default relative overflow-hidden group"
              style={{
                backgroundColor: bg,
                border: `1px solid ${clr}20`,
              }}
            >
              {/* Subtle hover gleam */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              
              <div className="text-[11px] font-semibold text-white tracking-wide">
                {sec.name}
              </div>
              <div
                className="text-[10px] mt-0.5 font-numeric font-bold"
                style={{ color: clr }}
              >
                {sec.change >= 0 ? "+" : ""}
                {sec.change.toFixed(2)}%
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
