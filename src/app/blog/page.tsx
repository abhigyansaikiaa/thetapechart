"use client";

import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { BookOpen, Calendar, User, ArrowRight } from "lucide-react";

export const mockPosts = [
  {
    slug: "understanding-smc-order-blocks",
    title: "Understanding SMC Order Blocks in Crypto & Forex",
    excerpt: "A deep dive into identifying high-probability order blocks left behind by institutional algorithms.",
    date: "Jun 4, 2026",
    author: "The Tape Chart Research",
    category: "Smart Money Concepts",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=1200",
  },
  {
    slug: "nifty-pre-election-rally",
    title: "Nifty 50: Analyzing the Pre-Election Volatility Crush",
    excerpt: "Historical analysis of India VIX behavior during election cycles and how to position your options portfolio.",
    date: "Jun 2, 2026",
    author: "The Tape Chart Macro",
    category: "Market Analysis",
    imageUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=1200",
  },
  {
    slug: "building-systematic-trading-algo",
    title: "Building a Systematic Breakout Trading Algorithm",
    excerpt: "How to use Python and Pandas to backtest a simple 20-day high breakout strategy on Indian Equities.",
    date: "May 28, 2026",
    author: "The Tape Chart Quant",
    category: "Algorithmic Trading",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200",
  }
];

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 w-full bg-background pt-24 pb-12">
        <PageWrapper className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-flex items-center justify-center p-3 bg-accent/10 rounded-2xl mb-4">
              <BookOpen size={32} className="text-accent" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Market Insights & Education
            </h1>
            <p className="text-foreground-secondary text-lg max-w-2xl">
              Professional research, trading strategies, and in-depth educational content to give you the edge.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <article className="glass-card h-full flex flex-col overflow-hidden group cursor-pointer hover:-translate-y-1 transition-all duration-300 hover:shadow-xl hover:shadow-accent/5">
                  <div className="w-full h-48 overflow-hidden relative">
                    <img 
                      src={post.imageUrl} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-md border border-border px-3 py-1 rounded-full text-xs font-medium text-white">
                      {post.category}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h2 className="text-xl font-bold text-white mb-3 group-hover:text-accent transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-sm text-foreground-muted mb-6 line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-foreground-secondary pt-4 border-t border-border/50">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        {post.date}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User size={14} />
                        {post.author}
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </PageWrapper>
      </main>
      <Footer />
    </div>
  );
}
