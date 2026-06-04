"use client";

import { PageWrapper } from "@/components/layout/PageWrapper";
import { FileText, CheckCircle2 } from "lucide-react";

export default function TermsPage() {
  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto py-12 px-6 bg-surface-elevated/30 rounded-3xl border border-border/50">
        
        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-20 h-20 bg-accent/10 border border-accent/20 rounded-full flex items-center justify-center mb-6">
            <FileText className="text-accent w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-4">Terms of Service</h1>
          <p className="text-foreground-secondary text-lg max-w-2xl">
            Legally binding terms regarding the usage of the The Tape Chart Quantitative Terminal.
          </p>
        </div>

        <div className="prose prose-invert max-w-none text-foreground-secondary space-y-6">
          <p>
            Welcome to The Tape Chart. By accessing or using our platform, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use our services.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            These terms represent a legally binding agreement between you and The Tape Chart. We reserve the right to modify these terms at any time. Your continued use of the platform constitutes your acceptance of the revised terms.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Software Use & API Limits</h2>
          <p>
            The Tape Chart integrates with third-party APIs (such as AlphaVantage and Google Gemini). You agree to use the software within the rate limits prescribed by these external providers. We reserve the right to suspend accounts that abuse API endpoints, attempt reverse engineering, or bypass security protocols.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Premium Monetization Tiers</h2>
          <p>
            Certain features (such as true millisecond WebSocket data) are locked behind premium subscription tiers. By subscribing, you agree to our recurring billing policies. Refunds are handled on a strict case-by-case basis and are generally not provided for partially used billing periods.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Intellectual Property</h2>
          <p>
            The quantitative models, design systems, algorithms, and prompt structures underlying The Tape Chart remain our exclusive property. You are granted a limited, non-transferable license to use the terminal for personal trading and educational purposes.
          </p>
          
          <div className="bg-surface p-6 rounded-xl border border-border/50 mt-8">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <CheckCircle2 className="text-positive" size={20} /> User Acknowledgment
            </h3>
            <p className="text-sm m-0">
              By checking the box during account creation, or by continuing to use the site, you acknowledge that you have read, understood, and agreed to these terms in their entirety, alongside our strict Financial Disclaimer regarding SEBI and RIA guidelines.
            </p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
