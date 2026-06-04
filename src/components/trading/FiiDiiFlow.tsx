"use client";

import { FiiDiiDay } from "@/lib/dashboardData";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

interface FiiDiiFlowProps {
  data: FiiDiiDay[];
}

export function FiiDiiFlow({ data }: FiiDiiFlowProps) {
  // Calculate total net for display (using latest day as example)
  const latestData = data[data.length - 1];
  
  return (
    <div className="card p-4 rounded-xl flex flex-col">
      <h2 className="text-sm font-semibold text-white mb-3 tracking-wide">
        FII / DII Flow
      </h2>
      
      <div className="grid grid-cols-2 gap-2 mb-4">
        {/* FII Box */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-accent/5 rounded-lg p-2.5 border border-accent/15 hover:border-accent/30 transition-colors group"
        >
          <div className="text-[9px] text-foreground-secondary mb-1 font-bold tracking-widest">
            FII NET
          </div>
          <div className="text-[15px] font-extrabold text-positive font-numeric tracking-tight group-hover:scale-105 transition-transform origin-left">
            {latestData.fii >= 0 ? "+" : ""}₹{latestData.fii.toLocaleString()}Cr
          </div>
        </motion.div>
        
        {/* DII Box */}
        <motion.div 
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-purple-500/5 rounded-lg p-2.5 border border-purple-500/15 hover:border-purple-500/30 transition-colors group"
        >
          <div className="text-[9px] text-foreground-secondary mb-1 font-bold tracking-widest">
            DII NET
          </div>
          <div className="text-[15px] font-extrabold text-positive font-numeric tracking-tight group-hover:scale-105 transition-transform origin-left">
            {latestData.dii >= 0 ? "+" : ""}₹{latestData.dii.toLocaleString()}Cr
          </div>
        </motion.div>
      </div>
      
      <div className="flex-1 min-h-[80px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="colorFii" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorDii" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="date" 
              tick={{ fill: "#6B7280", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              dy={5}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border)",
                borderRadius: "8px",
                fontSize: "12px",
                fontFamily: "var(--font-jetbrains)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
              }}
              itemStyle={{ fontWeight: "bold" }}
              formatter={(value: any) => [`₹${value}Cr`]}
            />
            <Area
              type="monotone"
              dataKey="fii"
              name="FII"
              stroke="#3B82F6"
              fill="url(#colorFii)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0, fill: "#3B82F6" }}
            />
            <Area
              type="monotone"
              dataKey="dii"
              name="DII"
              stroke="#8B5CF6"
              fill="url(#colorDii)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0, fill: "#8B5CF6" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
