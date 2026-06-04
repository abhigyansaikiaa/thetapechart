"use client";

import { use } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { mockPosts } from "../page";

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const post = mockPosts.find(p => p.slug === resolvedParams.slug);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-24 text-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-4">Post Not Found</h1>
            <Link href="/blog" className="text-accent hover:underline">Return to Blog</Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 w-full bg-background pt-24 pb-20">
        <PageWrapper className="container mx-auto px-4 max-w-3xl">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-foreground-secondary hover:text-white transition-colors mb-8">
            <ArrowLeft size={16} /> Back to Blog
          </Link>
          
          <article>
            <header className="mb-10 text-center md:text-left">
              <div className="inline-block bg-accent/10 border border-accent/20 px-3 py-1 rounded-full text-xs font-medium text-accent mb-4">
                {post.category}
              </div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-foreground-secondary">
                <div className="flex items-center gap-1.5">
                  <User size={16} />
                  {post.author}
                </div>
                <div className="w-1 h-1 rounded-full bg-border" />
                <div className="flex items-center gap-1.5">
                  <Calendar size={16} />
                  {post.date}
                </div>
                <div className="w-1 h-1 rounded-full bg-border" />
                <div>5 min read</div>
              </div>
            </header>

            <div className="w-full h-64 md:h-96 rounded-xl overflow-hidden mb-12 border border-border">
              <img 
                src={post.imageUrl} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="prose prose-invert prose-lg max-w-none text-foreground-secondary">
              <p className="lead text-xl text-white font-medium mb-8">
                {post.excerpt}
              </p>
              
              <p>
                In the highly competitive world of trading, understanding where institutional money is placed is paramount. Order blocks represent massive areas of liquidity where "Smart Money" enters the market. Unlike retail traders who buy at market, institutions must engineer liquidity to fill their massive orders without causing slippage.
              </p>

              <h2 className="text-white mt-10 mb-4 font-bold text-2xl">What is an Order Block?</h2>
              
              <p>
                An order block is fundamentally the last down-candle before a strong impulsive up-move (Bullish OB), or the last up-candle before a strong impulsive down-move (Bearish OB). It signifies the point of origin where institutions accumulated their positions. 
              </p>

              <div className="bg-surface-elevated border-l-4 border-l-accent p-6 my-8 rounded-r-lg">
                <p className="m-0 font-medium text-white italic">
                  "Price is fractal. The same order blocks that form on the monthly chart will form on the 1-minute chart. The only difference is the amount of liquidity and time."
                </p>
              </div>

              <h2 className="text-white mt-10 mb-4 font-bold text-2xl">Identifying High Probability Order Blocks</h2>
              
              <ul>
                <li><strong>Liquidity Sweep:</strong> The order block must have swept a previous high or low (taken liquidity) before the impulsive move.</li>
                <li><strong>Fair Value Gap (FVG):</strong> The impulsive move away from the order block should leave a gap in price delivery.</li>
                <li><strong>Break of Structure (BOS):</strong> The move should break a significant swing high or low.</li>
              </ul>

              <p>
                When price returns to this unmitigated order block, we look for lower timeframe confirmation to enter in the direction of the institutional trend.
              </p>
            </div>
          </article>
        </PageWrapper>
      </main>
      <Footer />
    </div>
  );
}
