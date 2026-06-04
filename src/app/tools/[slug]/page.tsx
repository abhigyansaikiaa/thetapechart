"use client";

import { use } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { toolsList } from "../page";
import { ArrowLeft, Calculator } from "lucide-react";
import { PositionSizeCalculator } from "@/components/tools/PositionSizeCalculator";

export default function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const tool = toolsList.find(t => t.slug === slug);

  if (!tool) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-24 text-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-4">Tool Not Found</h1>
            <Link href="/tools" className="text-accent hover:underline">Return to Tools</Link>
          </div>
        </main>
      </div>
    );
  }

  // Render specific tool components based on slug, fallback to a placeholder
  const renderTool = () => {
    switch (slug) {
      case "position-size":
        return <PositionSizeCalculator />;
      default:
        return (
          <div className="glass-card p-12 flex flex-col items-center justify-center text-center">
            <Calculator size={48} className="text-foreground-muted mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">{tool.name}</h2>
            <p className="text-foreground-secondary mb-6">This calculator is currently under development.</p>
            <div className="animate-pulse bg-surface-elevated h-2 w-48 rounded-full overflow-hidden">
              <div className="bg-accent h-full w-1/2"></div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 w-full bg-background pt-24 pb-12">
        <PageWrapper className="container mx-auto px-4 max-w-4xl">
          <Link href="/tools" className="inline-flex items-center gap-2 text-sm font-medium text-foreground-secondary hover:text-white transition-colors mb-8">
            <ArrowLeft size={16} /> Back to Tools
          </Link>
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">{tool.name}</h1>
            <p className="text-foreground-secondary">{tool.desc}</p>
          </div>

          {renderTool()}
        </PageWrapper>
      </main>
      <Footer />
    </div>
  );
}
