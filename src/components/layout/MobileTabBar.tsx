"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Zap, Newspaper, Activity, LayoutGrid } from "lucide-react";

const mobileItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Analyze", href: "/analyze", icon: Zap },
  { name: "News", href: "/news", icon: Newspaper },
  { name: "Backtest", href: "/backtester", icon: Activity },
  { name: "More", href: "/tools", icon: LayoutGrid },
];

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-lg border-t border-border/50 pb-safe">
      <nav className="flex justify-around items-center h-16">
        {mobileItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? "text-accent" : "text-foreground-secondary hover:text-white"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="mobile-tab-active"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-accent rounded-b-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
