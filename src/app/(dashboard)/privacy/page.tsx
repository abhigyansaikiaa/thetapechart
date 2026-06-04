import { ShieldCheck, Lock, EyeOff } from "lucide-react";
import Image from "next/image";

export default function PrivacyPage() {
  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto py-8">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden glass-card border-none shadow-2xl h-[300px]">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-transparent z-10" />
        <Image 
          src="/legal-hero.png" 
          alt="Legal and Trust"
          width={1200}
          height={400}
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-end px-8 pb-12">
          <div className="flex items-center gap-4 mb-2">
            <ShieldCheck className="text-positive" size={32} />
            <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
          </div>
          <p className="text-foreground-secondary">Your data sovereignty is our priority.</p>
        </div>
      </div>

      <div className="glass-card p-8 space-y-8">
        <section>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Lock className="text-accent" size={20} /> Data Collection & Telemetry
          </h2>
          <p className="text-foreground-secondary leading-relaxed">
            The Tape Chart collects minimal telemetry required to operate the trading terminal. We process your authentication states via Clerk, and store your Trading Ledger entries securely via Supabase. We do not sell your personal trading data, journal entries, or portfolio balances to third-party hedge funds or market makers (PFOF).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <EyeOff className="text-accent" size={20} /> Image Processing Privacy
          </h2>
          <p className="text-foreground-secondary leading-relaxed">
            When you upload a trading chart to the Quantitative Co-Pilot for SMC/ICT analysis:
          </p>
          <ul className="list-disc pl-5 mt-4 text-foreground-secondary space-y-2">
            <li>Images are transmitted via encrypted TLS endpoints to Anthropic's Claude API.</li>
            <li>Images are processed statelessly for the purpose of generating the analysis prompt.</li>
            <li>We do not retain raw image files on The Tape Chart servers post-analysis unless you explicitly save the analysis to your Trade Journal.</li>
          </ul>
        </section>

      </div>
    </div>
  );
}
