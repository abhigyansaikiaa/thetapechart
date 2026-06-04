import Link from "next/link";
import { ArrowRight, MessageCircle, Globe, Link as LinkIcon, Mail } from "lucide-react";
import { NewsletterForm } from "./NewsletterForm";

export function Footer() {
  return (
    <footer className="relative w-full border-t border-border/50 bg-[#0A0A0B] overflow-hidden mt-16">
      {/* Decorative Gradient Background Effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-positive/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 pt-20 pb-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 border-b border-border/40 pb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
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
              The ultimate institutional-grade quantitative trading terminal. 
              Powered by advanced machine learning models and real-time market data to give you the ultimate edge.
            </p>

            <div className="flex items-center gap-4 mt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-surface-elevated border border-border flex items-center justify-center text-foreground-muted hover:text-white hover:border-accent/50 hover:bg-accent/10 transition-all duration-300">
                <MessageCircle size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-surface-elevated border border-border flex items-center justify-center text-foreground-muted hover:text-white hover:border-accent/50 hover:bg-accent/10 transition-all duration-300">
                <Globe size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-surface-elevated border border-border flex items-center justify-center text-foreground-muted hover:text-white hover:border-accent/50 hover:bg-accent/10 transition-all duration-300">
                <LinkIcon size={18} />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold tracking-wide uppercase text-xs mb-2">Platform</h4>
            <Link href="/" className="text-sm text-foreground-muted hover:text-accent transition-colors w-fit">Terminal</Link>
            <Link href="/chart" className="text-sm text-foreground-muted hover:text-accent transition-colors w-fit">Advanced Charting</Link>
            <Link href="/bot" className="text-sm text-foreground-muted hover:text-accent transition-colors w-fit">AI Auto-Trading</Link>
            <Link href="/journal" className="text-sm text-foreground-muted hover:text-accent transition-colors w-fit">Trade Journal</Link>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold tracking-wide uppercase text-xs mb-2">Intelligence</h4>
            <Link href="/screener" className="text-sm text-foreground-muted hover:text-accent transition-colors w-fit">Stock Screener</Link>
            <Link href="/options" className="text-sm text-foreground-muted hover:text-accent transition-colors w-fit">Options Chain</Link>
            <Link href="/macro" className="text-sm text-foreground-muted hover:text-accent transition-colors w-fit">Macro Data</Link>
            <Link href="/mentor" className="text-sm text-foreground-muted hover:text-accent transition-colors w-fit">AI Mentor</Link>
          </div>

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
