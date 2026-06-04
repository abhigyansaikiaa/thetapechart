import { NextResponse } from 'next/server';
import { NseIndia } from 'stock-nse-india';

// Create a singleton instance to reuse the session (cookies)
const nse = new NseIndia();

export const revalidate = 60; // Next.js app router route cache (60 seconds)

export async function GET() {
  try {
    const indicesData = await nse.getAllIndices();
    
    // The NSE API usually returns an array under `data` for all indices
    const indicesArray = indicesData.data || [];
    
    // We only care about specific indices for the dashboard
    const TARGET_INDICES = [
      "NIFTY 50",
      "NIFTY BANK",
      "NIFTY FIN SERVICE",
      "NIFTY IT",
      "NIFTY NEXT 50",
      "NIFTY MIDCAP 50"
    ];

    const filtered = indicesArray
      .filter((idx: any) => TARGET_INDICES.includes(idx.indexSymbol))
      .map((idx: any) => ({
        symbol: idx.indexSymbol,
        name: idx.index,
        price: idx.last || idx.currentValue,
        change: idx.change,
        changePercent: idx.percentChange,
        isPositive: idx.percentChange >= 0
      }));

    // Ensure we always return something even if filtering fails
    if (filtered.length === 0) {
      console.warn("NSE indices fetch returned no target indices. Data:", indicesData);
    }

    return NextResponse.json(filtered, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
      }
    });
  } catch (error) {
    console.error("Failed to fetch NSE indices:", error);
    return NextResponse.json(
      { error: "Failed to fetch market data" }, 
      { status: 500 }
    );
  }
}
