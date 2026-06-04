"use client";

import Link from "next/link";
import { QuickAccessItem } from "@/lib/dashboardData";
import { motion } from "framer-motion";

interface QuickAccessGridProps {
  items: QuickAccessItem[];
}

export function QuickAccessGrid({ items }: QuickAccessGridProps) {
  return (
    <div className="card p-4 rounded-xl md:col-span-2">
      <h2 className="text-sm font-semibold text-white mb-4 tracking-wide">
        Quick Access
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {items.map((item, i) => (
          <motion.div
            key={item.href}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              href={item.href}
              className="block bg-background/50 border border-border/60 hover:border-accent/40 rounded-lg p-3 transition-all duration-300 hover:bg-surface hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(59,130,246,0.08)] group"
            >
              <div className="text-xl mb-1.5 transform group-hover:scale-110 transition-transform origin-bottom-left">
                {item.emoji}
              </div>
              <div className="text-[12px] font-semibold text-foreground group-hover:text-accent transition-colors">
                {item.label}
              </div>
              <div className="text-[10px] text-foreground-muted mt-0.5">
                {item.desc}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
