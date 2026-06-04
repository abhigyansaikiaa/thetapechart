import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AlertTriangle, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 w-full flex items-center justify-center p-4">
        <div className="glass-card p-12 flex flex-col items-center text-center max-w-md">
          <div className="p-4 bg-warning/10 text-warning rounded-full mb-6">
            <AlertTriangle size={48} />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">404</h1>
          <h2 className="text-xl font-semibold text-white mb-4">Trade Not Found</h2>
          <p className="text-foreground-secondary mb-8">
            The liquidity pool you are looking for has been swept. Return to the dashboard to find new setups.
          </p>
          <Link 
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover text-white rounded-md font-medium transition-colors"
          >
            <Home size={18} /> Back to Dashboard
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
