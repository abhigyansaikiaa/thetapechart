"use client";

import { motion } from "framer-motion";
import { Rocket, Sparkles, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { PageWrapper } from "./PageWrapper";

interface ComingSoonProps {
  title: string;
  description: string;
}

export function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <PageWrapper className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
      <div className="relative w-full max-w-2xl mx-auto flex flex-col items-center justify-center text-center p-8">
        
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/20 blur-[100px] rounded-full -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 blur-[120px] rounded-full -z-10" />

        {/* Animated Icon */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative mb-8"
        >
          <div className="w-24 h-24 rounded-2xl bg-surface border border-border/50 flex items-center justify-center shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-transparent opacity-50" />
            <Rocket size={40} className="text-white relative z-10" />
          </div>
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute -top-3 -right-3 text-accent"
          >
            <Sparkles size={24} />
          </motion.div>
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-elevated border border-border/50 text-xs font-semibold text-foreground-muted mb-6">
            <Clock size={14} className="text-warning" />
            In Development
          </div>
          
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            {title}
          </h1>
          
          <p className="text-foreground-secondary text-base md:text-lg max-w-lg mx-auto leading-relaxed mb-8">
            {description}
          </p>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link href="/">
            <button className="flex items-center gap-2 px-6 py-3 bg-white text-black hover:bg-white/90 font-bold rounded-xl transition-all shadow-lg hover:shadow-white/10 group">
              Back to Dashboard
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
