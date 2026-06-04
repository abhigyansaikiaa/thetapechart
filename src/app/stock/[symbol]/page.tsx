import { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Building2, TrendingUp, BarChart3, LineChart } from 'lucide-react';
import Link from 'next/link';

// Mock function to simulate fetching stock data for SEO
async function getStockData(symbol: string) {
  return {
    symbol: symbol.toUpperCase(),
    name: `${symbol.toUpperCase()} Ltd.`,
    price: 1540.25,
    change: 25.40,
    changePercent: 1.65,
    sector: "Technology",
    description: `${symbol.toUpperCase()} Ltd is a leading global technology company providing IT services, consulting, and business solutions.`
  };
}

export async function generateMetadata({ params }: { params: Promise<{ symbol: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const data = await getStockData(resolvedParams.symbol);
  
  return {
    title: `${data.name} (${data.symbol}) Share Price, Analysis & Technicals`,
    description: `Get live share price, institutional order flow analysis, Smart Money Concepts (SMC) setups, and fundamental data for ${data.name} (${data.symbol}).`,
    openGraph: {
      title: `${data.symbol} Share Price & Analysis | The Tape Chart`,
      description: `Comprehensive institutional analysis for ${data.name}.`,
    }
  };
}

export default async function PublicStockPage({ params }: { params: Promise<{ symbol: string }> }) {
  const resolvedParams = await params;
  const data = await getStockData(resolvedParams.symbol);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 w-full bg-background pt-24 pb-20">
        <PageWrapper className="container mx-auto px-4 max-w-5xl">
          
          {/* Header Section */}
          <div className="glass-card p-8 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-surface-elevated border border-border flex items-center justify-center">
                  <Building2 size={32} className="text-accent" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{data.name}</h1>
                  <div className="flex gap-2 text-xs font-medium">
                    <span className="bg-surface-elevated px-2 py-1 rounded text-foreground-secondary">{data.symbol}</span>
                    <span className="bg-surface-elevated px-2 py-1 rounded text-foreground-secondary">NSE</span>
                    <span className="bg-surface-elevated px-2 py-1 rounded text-foreground-secondary">{data.sector}</span>
                  </div>
                </div>
              </div>
              <div className="text-left md:text-right">
                <p className="text-sm text-foreground-secondary mb-1">Current Price</p>
                <p className="text-4xl font-numeric font-bold text-white mb-1">₹{data.price.toLocaleString()}</p>
                <p className="text-positive font-numeric font-medium flex items-center md:justify-end gap-1">
                  <TrendingUp size={18} /> +{data.change} ({data.changePercent}%)
                </p>
              </div>
            </div>
            <p className="mt-6 text-foreground-secondary leading-relaxed max-w-3xl">
              {data.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="glass-card p-6 flex flex-col justify-center items-center text-center h-64 border-accent/20 bg-gradient-to-br from-surface to-accent/5">
              <LineChart size={48} className="text-accent mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Institutional Technical Analysis</h2>
              <p className="text-foreground-secondary text-sm mb-6 max-w-sm">
                Unlock advanced Smart Money Concept (SMC) charting, order block identification, and AI trend analysis for {data.symbol}.
              </p>
              <Link href="/analyze" className="px-6 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-md font-medium transition-colors">
                Analyze Chart
              </Link>
            </div>
            <div className="glass-card p-6 flex flex-col justify-center items-center text-center h-64">
              <BarChart3 size={48} className="text-foreground-muted mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Deep Fundamental Dive</h2>
              <p className="text-foreground-secondary text-sm mb-6 max-w-sm">
                Access DCF models, Graham Number calculations, peer comparisons, and detailed historical financials.
              </p>
              <Link href={`/fundamental/${data.symbol}`} className="px-6 py-2.5 bg-surface-elevated hover:bg-surface-hover border border-border text-white rounded-md font-medium transition-colors">
                View Financials
              </Link>
            </div>
          </div>

        </PageWrapper>
      </main>
      <Footer />
    </div>
  );
}
