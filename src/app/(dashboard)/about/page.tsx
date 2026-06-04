"use client";

import { Shield, Target, Users, Zap, Brain, LineChart, Globe, Lock } from "lucide-react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { PageWrapper } from "@/components/layout/PageWrapper";

export default function AboutPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <PageWrapper className="pb-16">
      <div className="flex flex-col gap-12 max-w-5xl mx-auto py-8">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative rounded-3xl overflow-hidden glass-card border border-white/10 shadow-2xl group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40 z-10" />
          <Image 
            src="/about-hero.png" 
            alt="Alphaedge Institutional Trading Desk"
            width={1200}
            height={600}
            className="w-full h-[450px] object-cover opacity-50 group-hover:opacity-60 transition-opacity duration-700"
          />
          <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 md:px-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-bold tracking-widest uppercase mb-6">
                <Brain size={16} /> Advanced AI Analytics
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
                Institutional Intelligence.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-500">
                  Retail Execution.
                </span>
              </h1>
              <p className="text-lg md:text-xl text-foreground-secondary max-w-2xl leading-relaxed font-medium">
                Alphaedge is engineered to bridge the massive technological gap between retail traders and elite institutional quants. Powered by advanced AI models and global real-time market pipelines.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Introduction Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto space-y-6"
        >
          <h2 className="text-3xl font-bold text-white">The Edge You Need to Succeed</h2>
          <p className="text-foreground-secondary text-lg leading-relaxed">
            In today's algorithmic markets, trading with lagging indicators is a guaranteed path to failure. Alphaedge provides retail traders with a unified terminal that processes macroeconomic data, global market flows, and deep technical structures instantly. We don't just show you charts; we show you where the liquidity is.
          </p>
        </motion.div>

        {/* Core Values Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Feature 1 */}
          <motion.div variants={itemVariants} className="card p-8 rounded-2xl hover:border-accent/50 transition-colors group">
            <div className="p-3 bg-accent/10 w-fit rounded-xl mb-6 group-hover:scale-110 transition-transform">
              <Target className="text-accent" size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">SMC & ICT Focused</h3>
            <p className="text-foreground-secondary leading-relaxed text-sm">
              Our AI engine is hardcoded to recognize Smart Money Concepts. It identifies liquidity sweeps, fair value gaps, and institutional order blocks with extreme precision across multiple timeframes.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div variants={itemVariants} className="card p-8 rounded-2xl hover:border-blue-500/50 transition-colors group">
            <div className="p-3 bg-blue-500/10 w-fit rounded-xl mb-6 group-hover:scale-110 transition-transform">
              <Globe className="text-blue-500" size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Global Market Pipelines</h3>
            <p className="text-foreground-secondary leading-relaxed text-sm">
              We process real-time pricing for US Equities, Indian Markets (NSE/BSE), Forex, and Crypto. Monitor intermarket correlations globally without ever leaving the dashboard.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div variants={itemVariants} className="card p-8 rounded-2xl hover:border-positive/50 transition-colors group">
            <div className="p-3 bg-positive/10 w-fit rounded-xl mb-6 group-hover:scale-110 transition-transform">
              <Zap className="text-positive" size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Real-Time Synthesis</h3>
            <p className="text-foreground-secondary leading-relaxed text-sm">
              Market environments shift in milliseconds. Our backend digests everything from fundamental EPS shifts to macroeconomic inflation data, ensuring your bias is always aligned with the narrative.
            </p>
          </motion.div>

          {/* Feature 4 */}
          <motion.div variants={itemVariants} className="card p-8 rounded-2xl hover:border-orange-500/50 transition-colors group">
            <div className="p-3 bg-orange-500/10 w-fit rounded-xl mb-6 group-hover:scale-110 transition-transform">
              <LineChart className="text-orange-500" size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Advanced Charting</h3>
            <p className="text-foreground-secondary leading-relaxed text-sm">
              Powered by TradingView, our charting interface offers full Pine Script support, institutional volume profiles, and drawing tools to map out your high-probability setups perfectly.
            </p>
          </motion.div>

          {/* Feature 5 */}
          <motion.div variants={itemVariants} className="card p-8 rounded-2xl hover:border-purple-500/50 transition-colors group lg:col-span-2">
            <div className="p-3 bg-purple-500/10 w-fit rounded-xl mb-6 group-hover:scale-110 transition-transform">
              <Shield className="text-purple-500" size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Institutional Grade Security & Risk</h3>
            <p className="text-foreground-secondary leading-relaxed text-sm max-w-2xl">
              Trading isn't just about entries; it's about survival. Alphaedge incorporates dynamic risk management calculators, dynamic stop-loss trailing suggestions, and automated journaling to ensure you are managing risk like a professional portfolio manager.
            </p>
          </motion.div>
        </motion.div>

      </div>
    </PageWrapper>
  );
}
