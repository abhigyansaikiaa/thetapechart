"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Target, 
  LineChart, 
  BookOpen, 
  Eye, 
  PieChart, 
  Calculator, 
  Newspaper,
  GraduationCap,
  Settings,
  Zap,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Bot,
  Monitor,
  Activity,
  BrainCircuit,
  CalendarDays
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const sidebarGroups = [
  {
    title: "Trading",
    items: [
      { name: "Dashboard", href: "/", icon: LayoutDashboard },
      { name: "Stock Terminal", href: "/terminal", icon: Monitor },
      { name: "Advanced Charting", href: "/chart", icon: LineChart },
      { name: "AI Auto-Trading", href: "/bot", icon: Bot },
      { name: "Investment Planner", href: "/planner", icon: Target },
      { name: "Trade Journal", href: "/journal", icon: BookOpen },
      { name: "Watchlist", href: "/watchlist", icon: Eye },
    ]
  },
  {
    title: "Research",
    items: [
      { name: "Stock Screener", href: "/screener", icon: LineChart },
      { name: "Options Chain", href: "/options", icon: PieChart },
      { name: "Mutual Funds", href: "/mf", icon: PieChart },
      { name: "Macro Data", href: "/macro", icon: LineChart },
    ]
  },
  {
    title: "Intelligence",
    items: [
      { name: "Economic Calendar", href: "/calendar", icon: CalendarDays },
      { name: "News & Sentiment", href: "/news", icon: Newspaper },
      { name: "Learning Library", href: "/learn", icon: GraduationCap },
      { name: "Calculators", href: "/tools", icon: Calculator },
    ]
  },
  {
    title: "Pro Tools",
    items: [
      { name: "Dark Pool Flow", href: "/darkpool", icon: Eye },
      { name: "Algo Backtester", href: "/backtester", icon: Activity },
      { name: "Trading Psychology", href: "/psychology", icon: BrainCircuit },
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside 
      initial={false}
      animate={{ width: collapsed ? 80 : 260 }}
      className="hidden md:flex flex-col h-[calc(100vh-4rem)] sticky top-16 border-r border-border/50 bg-surface/50 backdrop-blur-xl z-40 transition-all duration-300"
    >
      <div className="flex-1 overflow-y-auto py-6 px-3 scrollbar-hide">
        {sidebarGroups.map((group, i) => (
          <div key={group.title} className={`mb-6 ${i !== 0 ? "pt-2" : ""}`}>
            {!collapsed && (
              <h3 className="px-3 mb-2 text-xs font-semibold text-foreground-muted uppercase tracking-wider">
                {group.title}
              </h3>
            )}
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
                const Icon = item.icon;
                
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors group relative ${
                        isActive 
                          ? "bg-accent/10 text-accent" 
                          : "text-foreground-secondary hover:text-white hover:bg-surface-hover"
                      }`}
                    >
                      <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-accent" : "text-foreground-secondary group-hover:text-white"} />
                      
                      {!collapsed && (
                        <span className={`text-sm font-medium ${isActive ? "text-accent" : ""}`}>
                          {item.name}
                        </span>
                      )}

                      {/* Tooltip when collapsed */}
                      {collapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-surface-elevated text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 border border-border">
                          {item.name}
                        </div>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-border/50 flex flex-col gap-2">
        <Link 
          href="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-foreground-secondary hover:text-white hover:bg-surface-hover transition-colors group"
        >
          <Settings size={20} className="group-hover:rotate-45 transition-transform duration-300" />
          {!collapsed && <span className="text-sm font-medium">Settings</span>}
        </Link>
        
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full py-2 rounded-md text-foreground-muted hover:text-white hover:bg-surface-hover transition-colors"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
    </motion.aside>
  );
}
