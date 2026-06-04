"use client";

import { motion } from "framer-motion";

interface FearGreedGaugeProps {
  value: number;
  color: string;
  label: string;
}

export function FearGreedGauge({ value, color, label }: FearGreedGaugeProps) {
  // SVG Circle calculations
  const radius = 24;
  const circumference = 2 * Math.PI * radius; // ~150.8
  
  // Calculate stroke dash array for the gauge
  // It covers roughly 75% of a circle (we leave a gap at bottom)
  // Max value is 100, so percentage is value/100
  // Value * 1.508 converts 0-100 to 0-150.8
  const strokeDasharray = `${value * 1.508} ${circumference}`;
  
  // Offset to start from bottom left and go clockwise
  const strokeDashoffset = 37.7; 

  return (
    <div>
      <h2 className="text-sm font-semibold text-white mb-4 tracking-wide">
        Fear & Greed Index
      </h2>
      
      <div className="flex items-center gap-4 mb-2">
        <div className="relative w-16 h-16 flex-shrink-0">
          <svg viewBox="0 0 60 60" width="100%" height="100%">
            {/* Background Track */}
            <circle
              cx="30"
              cy="30"
              r={radius}
              fill="none"
              stroke="var(--color-border)"
              strokeWidth="6"
            />
            {/* Value Track */}
            <motion.circle
              cx="30"
              cy="30"
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth="6"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 30 30)"
              initial={{ strokeDasharray: `0 ${circumference}` }}
              animate={{ strokeDasharray }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              style={{
                filter: `drop-shadow(0 0 4px ${color}40)`,
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span 
              className="text-sm font-extrabold font-numeric"
              style={{ color }}
            >
              {value}
            </span>
          </div>
        </div>
        
        <div>
          <div 
            className="text-sm font-bold tracking-wide"
            style={{ color }}
          >
            {label}
          </div>
          <div className="text-[11px] text-foreground-muted mt-0.5">
            India Market
          </div>
        </div>
      </div>
    </div>
  );
}
