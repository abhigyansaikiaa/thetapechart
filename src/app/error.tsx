"use client";

import { useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AlertOctagon, RefreshCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service in production
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 w-full flex items-center justify-center p-4">
        <div className="glass-card p-12 flex flex-col items-center text-center max-w-md border-negative/20">
          <div className="p-4 bg-negative/10 text-negative rounded-full mb-6">
            <AlertOctagon size={48} />
          </div>
          <h2 className="text-xl font-bold text-white mb-4">Stop Loss Hit (500 Error)</h2>
          <p className="text-foreground-secondary mb-8">
            Something went wrong on our end. Our quant engineers have been notified of this anomaly.
          </p>
          <button
            onClick={() => reset()}
            className="flex items-center gap-2 px-6 py-3 bg-surface-elevated hover:bg-surface-hover border border-border text-white rounded-md font-medium transition-colors"
          >
            <RefreshCcw size={18} /> Retry Connection
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
