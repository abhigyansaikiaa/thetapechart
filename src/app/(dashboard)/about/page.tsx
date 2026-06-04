import { Shield, Target, Users, Zap } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto py-8">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden glass-card border-none shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10" />
        <Image 
          src="/about-hero.png" 
          alt="The Tape Chart Institutional Trading Desk"
          width={1200}
          height={600}
          className="w-full h-[400px] object-cover opacity-60"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 md:px-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Institutional Intelligence.<br />Personal Execution.
          </h1>
          <p className="text-lg text-foreground-secondary max-w-2xl">
            The Tape Chart was forged to bridge the gap between retail execution and institutional 
            quant analysis. Powered by advanced Vision AI and real-time market pipelines.
          </p>
        </div>
      </div>

      {/* Core Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="glass-card p-8 hover:-translate-y-1 transition-transform duration-300">
          <div className="p-3 bg-accent/10 w-fit rounded-lg mb-6">
            <Target className="text-accent" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">SMC & ICT Focused</h2>
          <p className="text-foreground-secondary leading-relaxed">
            Unlike generic platforms that rely on outdated retail indicators, The Tape Chart's core 
            AI engine is hardcoded to recognize Smart Money Concepts. It identifies liquidity sweeps, 
            fair value gaps, and institutional order blocks with extreme precision.
          </p>
        </div>

        <div className="glass-card p-8 hover:-translate-y-1 transition-transform duration-300">
          <div className="p-3 bg-positive/10 w-fit rounded-lg mb-6">
            <Zap className="text-positive" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Real-Time Synthesis</h2>
          <p className="text-foreground-secondary leading-relaxed">
            Market environments shift in milliseconds. Our real-time data pipelines digest 
            everything from fundamental EPS shifts to macroeconomic inflation data, ensuring 
            your algorithmic bias is always aligned with the macro narrative.
          </p>
        </div>
      </div>
    </div>
  );
}
