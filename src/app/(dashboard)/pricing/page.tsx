"use client";

import { PageWrapper } from "@/components/layout/PageWrapper";
import { Check, ShieldCheck, Zap, Server, Code2 } from "lucide-react";
import { motion } from "framer-motion";

export default function PricingPage() {
  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        
        <div className="text-center mb-16 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Institutional Infrastructure.<br />
            <span className="text-accent">Retail Pricing.</span>
          </h1>
          <p className="text-lg text-foreground-secondary">
            Unlock millisecond WebSocket feeds, direct API access to the Gemini 1.5 Pro quantitative model, and unlimited SMC chart scans.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          
          {/* Basic Tier */}
          <div className="glass-card p-8 flex flex-col">
            <h3 className="text-xl font-bold text-white mb-2">Alpha Basic</h3>
            <p className="text-sm text-foreground-secondary mb-6 h-10">Essential tools for manual analysis.</p>
            <div className="mb-8">
              <span className="text-4xl font-bold text-white">Free</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              {[
                "15-minute Delayed Equities Data",
                "5 AI Chart Scans per month",
                "Basic Trade Journaling",
                "Standard Web Interface",
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-foreground-secondary">
                  <Check size={18} className="text-foreground-muted shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <button className="w-full py-3 bg-surface-elevated hover:bg-surface-hover border border-border text-white rounded-lg font-medium transition-colors">
              Current Plan
            </button>
          </div>

          {/* Pro Tier */}
          <div className="glass-card p-8 flex flex-col border-accent/50 relative transform md:-translate-y-4 shadow-[0_0_40px_rgba(37,99,235,0.1)]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Most Popular
            </div>
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><Zap size={20} className="text-accent"/> Alpha Pro</h3>
            <p className="text-sm text-foreground-secondary mb-6 h-10">Real-time infrastructure for active traders.</p>
            <div className="mb-8 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-white">₹2,499</span>
              <span className="text-foreground-muted">/month</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              {[
                "Real-Time NSE Equities (1s tick)",
                "Unlimited Gemini 1.5 AI Chat",
                "100 AI Chart Vision Scans/mo",
                "Automated Investment Planner",
                "Export Journal to CSV/PDF",
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-white font-medium">
                  <Check size={18} className="text-accent shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <button className="w-full py-3 bg-accent hover:bg-accent-hover text-white rounded-lg font-bold transition-all shadow-lg shadow-accent/20">
              Upgrade to Pro
            </button>
          </div>

          {/* Institutional Tier */}
          <div className="glass-card p-8 flex flex-col">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><Server size={20} className="text-foreground-muted"/> Institutional</h3>
            <p className="text-sm text-foreground-secondary mb-6 h-10">Direct API access and sub-millisecond feeds.</p>
            <div className="mb-8 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-white">₹14,999</span>
              <span className="text-foreground-muted">/month</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              {[
                "WebSocket Millisecond Feeds (NSE/BSE)",
                "Real-Time Options Chain Data",
                "Unlimited Everything",
                "REST API Access to Quant Models",
                "Dedicated Account Manager",
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-foreground-secondary">
                  <ShieldCheck size={18} className="text-foreground-muted shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <button className="w-full py-3 bg-surface-elevated hover:bg-surface-hover border border-border text-white rounded-lg font-medium transition-colors">
              Contact Sales
            </button>
          </div>

        </div>
      </div>
    </PageWrapper>
  );
}
