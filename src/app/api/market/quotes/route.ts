import { NextRequest, NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

export const revalidate = 60; // 60-second cache

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const symbolsParam = searchParams.get('symbols');
    
    if (!symbolsParam) {
      return NextResponse.json({ error: "Missing symbols" }, { status: 400 });
    }

    const symbols = symbolsParam.split(',').map(s => s.trim());
    const finnhubKey = process.env.FINNHUB_API_KEY || 'd8gtjv1r01qhjpmpl080d8gtjv1r01qhjpmpl08g';
    
    // We will separate symbols into Yahoo (India) and Finnhub (US/Crypto/Forex)
    const yahooSymbols: string[] = [];
    const finnhubSymbols: string[] = [];

    for (const sym of symbols) {
      if (sym.endsWith('.NS') || sym.endsWith('.BO') || sym.startsWith('^') || sym.endsWith('=X')) {
        yahooSymbols.push(sym);
      } else {
        finnhubSymbols.push(sym);
      }
    }

    const results: any[] = [];

    // 1. Fetch from Yahoo Finance (Indian Markets)
    if (yahooSymbols.length > 0) {
      try {
        const yfResults = await yahooFinance.quote(yahooSymbols);
        const quotes: any[] = Array.isArray(yfResults) ? yfResults : [yfResults];
        for (const q of quotes) {
          results.push({
            symbol: q.symbol,
            name: q.shortName || q.symbol,
            price: q.regularMarketPrice,
            change: q.regularMarketChange,
            changePercent: q.regularMarketChangePercent,
            isPositive: (q.regularMarketChange ?? 0) >= 0
          });
        }
      } catch (err) {
        console.error("Yahoo Finance error:", err);
      }
    }

    // 2. Fetch from Finnhub (US, Forex, Crypto)
    if (finnhubSymbols.length > 0 && finnhubKey) {
      // Finnhub doesn't support bulk quotes on free tier, so we fire them in parallel
      const fetchPromises = finnhubSymbols.map(async (sym) => {
        try {
          const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${sym}&token=${finnhubKey}`);
          if (res.ok) {
            const data = await res.json();
            if (data.c !== undefined && data.c !== 0) {
              return {
                symbol: sym,
                name: sym, // Finnhub quote doesn't return name, so we use symbol
                price: data.c,
                change: data.d,
                changePercent: data.dp,
                isPositive: data.d >= 0
              };
            }
          }
        } catch (err) {
          console.error(`Finnhub error for ${sym}:`, err);
        }
        return null;
      });

      const finnhubResults = await Promise.all(fetchPromises);
      for (const res of finnhubResults) {
        if (res) results.push(res);
      }
    }

    return NextResponse.json(results, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
      }
    });

  } catch (error) {
    console.error("Quotes API Error:", error);
    return NextResponse.json({ error: "Failed to fetch quotes" }, { status: 500 });
  }
}
