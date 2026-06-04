"use client";

import { PageWrapper } from "@/components/layout/PageWrapper";
import { AlertTriangle, ShieldCheck, Scale, FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function DisclaimerPage() {
  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto py-12 px-6 lg:px-8 bg-surface-elevated/30 rounded-3xl border border-border/50">
        
        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-20 h-20 bg-negative/10 border border-negative/20 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="text-negative w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-4">SEBI & Global Regulatory Disclaimer</h1>
          <p className="text-foreground-secondary text-lg max-w-2xl">
            Mandatory legal disclosures regarding algorithmic models, financial advice, and risk of total capital loss.
          </p>
        </div>

        <div className="prose prose-invert max-w-none text-foreground-secondary space-y-8">
          
          <section className="bg-surface p-6 rounded-xl border border-border/50">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Scale className="text-accent" /> 1. Not a Registered Investment Advisor (RIA)
            </h2>
            <p>
              <strong>THE TAPE CHART IS NOT A SEBI-REGISTERED INVESTMENT ADVISOR (RIA), PORTFOLIO MANAGER, OR BROKER-DEALER.</strong> 
            </p>
            <p>
              All content, models, AI outputs, chart analyses, and mathematical parameters provided by the The Tape Chart platform are for <strong>purely educational and informational purposes only</strong>. None of the algorithmic generation, Smart Money Concepts (SMC) tracking, or ICT analysis provided on this platform constitutes financial advice, a recommendation to buy/sell securities, or a solicitation of any kind. 
            </p>
            <p>
              The user explicitly acknowledges that they are utilizing a mathematical analysis tool and that they alone are entirely responsible for their own investment and trading decisions. We explicitly disclaim any liability, loss, or risk incurred as a consequence, directly or indirectly, of the use and application of any contents of this platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">2. High Risk Warning & Risk of Ruin</h2>
            <p>
              Trading in the financial markets, including equities, mutual funds, options, futures, and derivatives, carries a high level of risk and may not be suitable for all investors. The high degree of leverage available in options and futures can work against you as well as for you. Before deciding to trade, you should carefully consider your investment objectives, level of experience, and risk appetite.
            </p>
            <p className="text-negative font-medium bg-negative/10 p-4 rounded-lg border border-negative/20 mt-4">
              <strong>WARNING:</strong> There is a possibility that you may sustain a loss of some or all of your initial investment. Therefore, you should not invest money that you cannot afford to lose. You should be aware of all the risks associated with financial trading and seek advice from an independent, legally registered financial advisor if you have any doubts.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">3. AI & Algorithmic Fallibility</h2>
            <p>
              The algorithmic models ("Investment Planner", "Chart Analyzer", "AI Mentor") rely on Large Language Models (LLMs) and quantitative pattern matching to identify historical liquidity zones. 
              <strong>These models are strictly probabilistic, not deterministic.</strong> 
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>The AI can and will hallucinate data.</li>
              <li>Past performance of algorithmic models is absolutely no guarantee of future results.</li>
              <li>Real-time market conditions (black swan events, macro news) can invalidate quantitative setups instantly.</li>
              <li>The Tape Chart assumes no responsibility for algorithmic calculation errors, data feed latency, or API downtime.</li>
            </ul>
          </section>

          <section className="bg-surface p-6 rounded-xl border border-border/50">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <ShieldCheck className="text-accent" /> 4. Indemnification & Hold Harmless Agreement
            </h2>
            <p>
              By accessing, browsing, or using The Tape Chart, you agree to unconditionally indemnify, defend, and hold harmless The Tape Chart, its creators, developers, affiliates, and data providers from and against any and all claims, liabilities, damages, losses, costs, expenses, or fees (including reasonable attorneys' fees) that you incur as a result of or arising from your use of the platform.
            </p>
            <p>
              You waive your right to pursue legal action, class action lawsuits, or regulatory complaints against the creators of this software regarding financial losses incurred while utilizing the platform.
            </p>
          </section>
          
          <p className="text-xs text-foreground-muted text-center pt-8 border-t border-border/50">
            Last Updated: May 2026. This disclaimer operates under the jurisdiction of standard international software provision laws.
          </p>

        </div>
      </div>
    </PageWrapper>
  );
}
