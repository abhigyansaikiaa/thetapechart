import Link from "next/link";
import { NewsletterForm } from "./NewsletterForm";

export function Footer() {
  return (
    <footer className="relative w-full border-t border-border/50 bg-[#0A0A0B] overflow-hidden mt-16">
      {/* Decorative Gradient Background Effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-positive/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 pt-20 pb-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 border-b border-border/40 pb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div className="flex items-end justify-center gap-1 mr-2 h-8">
                <div className="w-2 h-4 bg-foreground-muted rounded-t-sm"></div>
                <div className="w-2 h-8 bg-white rounded-t-sm shadow-[0_0_12px_rgba(255,255,255,0.4)] group-hover:h-10 transition-all duration-300"></div>
                <div className="w-2 h-5 bg-foreground-muted rounded-t-sm"></div>
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-2xl font-extrabold tracking-tight text-white uppercase leading-none">
                  THE TAPE
                </span>
                <span className="text-sm font-light text-foreground-muted uppercase tracking-[0.2em] mt-0.5">
                  CHART
                </span>
              </div>
            </Link>
            
            <p className="text-sm text-foreground-secondary leading-relaxed max-w-sm">
              AI-powered quantitative trading intelligence platform. 
              Real-time market analysis and smart money insights.
            </p>
          </div>

          {/* Platform Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold tracking-wide uppercase text-xs mb-2">Platform</h4>
            <Link href="/" className="text-sm text-foreground-muted hover:text-accent transition-colors w-fit">Dashboard</Link>
            <Link href="/analyze" className="text-sm text-foreground-muted hover:text-accent transition-colors w-fit">AI Chart Analyze</Link>
            <Link href="/news" className="text-sm text-foreground-muted hover:text-accent transition-colors w-fit">News & Sentiment</Link>
            <Link href="/backtester" className="text-sm text-foreground-muted hover:text-accent transition-colors w-fit">Algo Backtester</Link>
          </div>

          {/* Intelligence Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold tracking-wide uppercase text-xs mb-2">Tools</h4>
            <Link href="/darkpool" className="text-sm text-foreground-muted hover:text-accent transition-colors w-fit">Dark Pool Flow</Link>
            <Link href="/psychology" className="text-sm text-foreground-muted hover:text-accent transition-colors w-fit">Trading Psychology</Link>
            <Link href="/learn" className="text-sm text-foreground-muted hover:text-accent transition-colors w-fit">Learning Library</Link>
            <Link href="/tools" className="text-sm text-foreground-muted hover:text-accent transition-colors w-fit">Calculators</Link>
          </div>

          {/* Legal Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold tracking-wide uppercase text-xs mb-2">Legal & Support</h4>
            <Link href="/about" className="text-sm text-foreground-muted hover:text-accent transition-colors w-fit">About Us</Link>
            <Link href="/privacy" className="text-sm text-foreground-muted hover:text-accent transition-colors w-fit">Privacy Policy</Link>
            <Link href="/terms" className="text-sm text-foreground-muted hover:text-accent transition-colors w-fit">Terms of Service</Link>
            <Link href="/disclaimer" className="text-sm text-foreground-muted hover:text-accent transition-colors w-fit">Disclaimer</Link>
          </div>

        </div>

        {/* Newsletter & Copyright Section */}
        <div className="pt-8 flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex-1 max-w-md w-full">
            <NewsletterForm />
          </div>
          
          <div className="text-center lg:text-right">
            <p className="text-xs text-foreground-muted leading-relaxed">
              &copy; {new Date().getFullYear()} The Tape Chart Systems. All rights reserved.<br/>
              Trading involves substantial risk of loss. Past performance is not indicative of future results.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
