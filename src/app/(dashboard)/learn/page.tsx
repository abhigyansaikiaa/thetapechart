"use client";

import { PageWrapper } from "@/components/layout/PageWrapper";
import { GraduationCap, BookOpen, PlayCircle, FileText, Lock } from "lucide-react";
import { motion } from "framer-motion";

const modules = [
  {
    title: "Market Microstructure",
    progress: 100,
    lessons: [
      { name: "Liquidity Providers & Takers", type: "video", completed: true },
      { name: "Order Book Dynamics", type: "article", completed: true },
    ]
  },
  {
    title: "Smart Money Concepts (SMC)",
    progress: 45,
    lessons: [
      { name: "Identifying Order Blocks", type: "video", completed: true },
      { name: "Fair Value Gaps (FVG) Deep Dive", type: "video", completed: false },
      { name: "Liquidity Sweeps & CHoCH", type: "article", completed: false },
    ]
  },
  {
    title: "Macroeconomic Drivers",
    progress: 0,
    locked: true,
    lessons: [
      { name: "Yield Curve Inversions", type: "video", completed: false },
      { name: "Central Bank Liquidity Cycles", type: "article", completed: false },
    ]
  }
];

export default function LearnPage() {
  return (
    <PageWrapper>
      <div className="flex flex-col gap-6 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <GraduationCap className="text-accent" size={28} />
              </div>
              Learning Library
            </h1>
            <p className="text-foreground-secondary text-sm">
              Master institutional trading frameworks through our structured curriculum.
            </p>
          </div>
          <div className="bg-surface-elevated border border-border px-4 py-2 rounded-lg flex flex-col items-end">
            <span className="text-xs text-foreground-muted mb-1">Overall Progress</span>
            <div className="flex items-center gap-3">
              <div className="w-32 bg-background rounded-full h-2 overflow-hidden border border-border/50">
                <div className="bg-accent h-full rounded-full" style={{ width: '45%' }}></div>
              </div>
              <span className="text-sm font-bold text-white">45%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {modules.map((mod, idx) => (
              <motion.div 
                key={mod.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`glass-card p-6 relative overflow-hidden ${mod.locked ? 'opacity-70' : ''}`}
              >
                {mod.locked && (
                  <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] z-10 flex items-center justify-center flex-col">
                    <Lock size={32} className="text-foreground-muted mb-2" />
                    <span className="text-sm font-medium text-foreground-secondary">Complete previous modules to unlock</span>
                  </div>
                )}
                
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-xl font-bold text-white">Module {idx + 1}: {mod.title}</h2>
                  <div className="text-right">
                    <span className="text-xs text-accent font-medium">{mod.progress}% Complete</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {mod.lessons.map(lesson => (
                    <div key={lesson.name} className="flex items-center justify-between p-3 bg-surface-elevated border border-border rounded-lg group hover:border-accent/50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        {lesson.type === 'video' ? <PlayCircle size={18} className="text-accent" /> : <FileText size={18} className="text-positive" />}
                        <span className="text-sm text-white group-hover:text-accent transition-colors">{lesson.name}</span>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        lesson.completed ? 'bg-positive/20 border-positive text-positive' : 'border-border'
                      }`}>
                        {lesson.completed && <span className="text-[10px]">✓</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="glass-card p-6 bg-gradient-to-br from-accent/10 to-surface border-accent/20">
              <h3 className="text-lg font-bold text-white mb-2">Next Up</h3>
              <p className="text-sm text-foreground-secondary mb-4">Fair Value Gaps (FVG) Deep Dive</p>
              <div className="aspect-video bg-black rounded-lg relative overflow-hidden border border-border group cursor-pointer">
                <img src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80" alt="Video thumbnail" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <PlayCircle size={48} className="text-white drop-shadow-lg group-hover:scale-110 transition-transform" />
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Resources</h3>
              <ul className="space-y-2 text-sm text-foreground-secondary">
                <li className="flex items-center gap-2 hover:text-white cursor-pointer transition-colors"><BookOpen size={14} /> Recommended Reading List</li>
                <li className="flex items-center gap-2 hover:text-white cursor-pointer transition-colors"><FileText size={14} /> Trading Plan Template</li>
                <li className="flex items-center gap-2 hover:text-white cursor-pointer transition-colors"><FileText size={14} /> Risk Management Checklist</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </PageWrapper>
  );
}
