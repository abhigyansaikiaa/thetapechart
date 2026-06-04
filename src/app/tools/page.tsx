"use client";

import Link from "next/link";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Calculator, ShieldCheck, Target, TrendingUp, BarChart3, PieChart, Activity, DollarSign, Percent, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const toolsList = [
  { slug: "position-size", name: "Position Size Calculator", desc: "Calculate exact lot size and risk based on account equity.", icon: Target },
  { slug: "risk-reward", name: "Risk:Reward Calculator", desc: "Determine R:R ratio and expectancy for your trade setup.", icon: ShieldCheck },
  { slug: "sip-returns", name: "SIP Returns Calculator", desc: "Project mutual fund wealth creation over time.", icon: TrendingUp },
  { slug: "fd-vs-sip", name: "FD vs SIP Comparison", desc: "Compare tax-adjusted returns of Fixed Deposits vs SIP.", icon: BarChart3 },
  { slug: "brokerage", name: "Brokerage Calculator", desc: "Calculate exact taxes and brokerage for Zerodha/Upstox.", icon: DollarSign },
  { slug: "option-premium", name: "Option Premium (Black-Scholes)", desc: "Calculate theoretical option prices using Black-Scholes.", icon: PieChart },
  { slug: "fo-margin", name: "F&O Margin Calculator", desc: "Calculate required span and exposure margin.", icon: Activity },
  { slug: "pivot-point", name: "Pivot Point Calculator", desc: "Calculate standard, Camarilla, and Fibonacci pivots.", icon: Target },
  { slug: "fibonacci", name: "Fibonacci Retracement", desc: "Calculate key Fib retracement and extension levels.", icon: Activity },
  { slug: "cagr", name: "CAGR Calculator", desc: "Calculate Compound Annual Growth Rate.", icon: Percent },
  { slug: "graham-number", name: "Graham Number Calculator", desc: "Find the intrinsic value based on Benjamin Graham's formula.", icon: ShieldCheck },
  { slug: "dcf", name: "DCF Valuation Calculator", desc: "Discounted Cash Flow model for intrinsic stock valuation.", icon: LineChart },
  { slug: "target-price", name: "Target Price Calculator", desc: "Project target price based on P/E expansion.", icon: Target },
  { slug: "candle-quiz", name: "Candle Pattern Quiz", desc: "Gamified test of your candlestick pattern knowledge.", icon: BookOpen },
];

// Re-import missing icons for the array
import { LineChart, BookOpen } from "lucide-react";

export default function ToolsIndexPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 w-full bg-background pt-24 pb-12">
        <PageWrapper className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-accent/10 rounded-2xl mb-4">
              <Calculator size={32} className="text-accent" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Free Trading Tools
            </h1>
            <p className="text-foreground-secondary text-lg">
              A complete suite of professional calculators for risk management, valuation, and technical analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {toolsList.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link key={tool.slug} href={`/tools/${tool.slug}`}>
                  <div className="glass-card p-6 h-full flex flex-col group cursor-pointer hover:-translate-y-1 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5">
                    <div className="w-10 h-10 rounded-lg bg-surface-elevated border border-border flex items-center justify-center mb-4 group-hover:bg-accent/10 group-hover:border-accent/20 transition-colors">
                      <Icon size={20} className="text-foreground-secondary group-hover:text-accent transition-colors" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-accent transition-colors">{tool.name}</h3>
                    <p className="text-sm text-foreground-muted leading-relaxed flex-1">
                      {tool.desc}
                    </p>
                    <div className="mt-4 pt-4 border-t border-border/50 flex items-center text-sm font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-300">
                      Use Calculator <ArrowRight size={16} className="ml-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </PageWrapper>
      </main>
      <Footer />
    </div>
  );
}
