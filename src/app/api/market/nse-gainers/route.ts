import { NextResponse } from 'next/server';
import { NseIndia } from 'stock-nse-india';

const nse = new NseIndia();

export const revalidate = 60; // 60-second cache

export async function GET() {
  try {
    // getEquityStockIndices returns the index details along with an array of all its constituents in `data`
    const indexData = await nse.getEquityStockIndices("NIFTY 50");
    
    const stocks = indexData?.data || [];
    
    // Filter out the index itself (usually has a symbol "NIFTY 50")
    const constituents = stocks.filter((s: any) => s.symbol !== "NIFTY 50");

    // Sort by percentChange
    const sorted = constituents.sort((a: any, b: any) => b.pChange - a.pChange);

    // Top 5 Gainers
    const gainers = sorted.slice(0, 5).map((s: any) => ({
      symbol: s.symbol,
      name: s.symbol,
      price: s.lastPrice,
      change: s.change,
      changePercent: s.pChange
    }));

    // Top 5 Losers
    const losers = sorted.slice(-5).reverse().map((s: any) => ({
      symbol: s.symbol,
      name: s.symbol,
      price: s.lastPrice,
      change: s.change,
      changePercent: s.pChange
    }));

    return NextResponse.json({ gainers, losers }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
      }
    });
  } catch (error) {
    console.error("Failed to fetch NSE gainers/losers:", error);
    return NextResponse.json(
      { error: "Failed to fetch gainers/losers data" }, 
      { status: 500 }
    );
  }
}
