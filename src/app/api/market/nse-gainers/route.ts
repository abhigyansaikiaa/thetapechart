import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

export const revalidate = 60; // 60-second cache

// A mix of global and Indian heavyweights to find top gainers/losers
const WATCHLIST = [
  "RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "INFY.NS", "ICICIBANK.NS", 
  "SBIN.NS", "BHARTIARTL.NS", "ITC.NS", "LARSEN.NS", "KOTAKBANK.NS",
  "AAPL", "MSFT", "NVDA", "TSLA", "META", "AMZN", "GOOGL", "AMD"
];

export async function GET() {
  try {
    const yfResults = await yahooFinance.quote(WATCHLIST);
    const quotes = Array.isArray(yfResults) ? yfResults : [yfResults];

    const constituents = quotes.map((q: any) => ({
      symbol: q.symbol,
      name: q.shortName || q.symbol,
      price: q.regularMarketPrice || 0,
      change: q.regularMarketChange || 0,
      changePercent: q.regularMarketChangePercent || 0
    }));

    // Sort by percentChange
    const sorted = constituents.sort((a, b) => b.changePercent - a.changePercent);

    // Top 5 Gainers
    const gainers = sorted.slice(0, 5);

    // Top 5 Losers
    const losers = sorted.slice(-5).reverse();

    return NextResponse.json({ gainers, losers }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
      }
    });
  } catch (error) {
    console.error("Failed to fetch gainers/losers:", error);
    return NextResponse.json(
      { error: "Failed to fetch gainers/losers data" }, 
      { status: 500 }
    );
  }
}
