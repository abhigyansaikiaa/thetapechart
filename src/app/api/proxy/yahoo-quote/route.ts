import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbols = searchParams.get("symbols");

  if (!symbols) {
    return NextResponse.json({ error: "symbols parameter is required" }, { status: 400 });
  }

  try {
    // Use Yahoo Finance v6 quote API (no auth required) via the chart endpoint
    // We'll fetch each symbol's quote via the chart API which still works publicly
    const symbolList = symbols.split(",").slice(0, 20); // Limit to 20 symbols
    
    const quotes = await Promise.all(
      symbolList.map(async (sym) => {
        try {
          const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym.trim())}?interval=1d&range=5d`;
          const response = await fetch(url, {
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            },
          });

          if (!response.ok) return null;

          const data = await response.json();
          const result = data.chart?.result?.[0];
          if (!result) return null;

          const meta = result.meta;
          const quotes = result.indicators?.quote?.[0];
          const timestamps = result.timestamp || [];
          
          // Get current price from meta
          const price = meta.regularMarketPrice || 0;
          const previousClose = meta.chartPreviousClose || meta.previousClose || price;
          const change = price - previousClose;
          const changePercent = previousClose ? (change / previousClose) * 100 : 0;

          // Get day high/low from latest data
          const lastIdx = timestamps.length - 1;
          const dayHigh = quotes?.high?.[lastIdx] || meta.regularMarketDayHigh || price;
          const dayLow = quotes?.low?.[lastIdx] || meta.regularMarketDayLow || price;
          const volume = quotes?.volume?.[lastIdx] || 0;

          return {
            symbol: meta.symbol || sym.trim(),
            name: meta.shortName || meta.longName || meta.symbol || sym.trim(),
            price,
            change: parseFloat(change.toFixed(4)),
            changePercent: parseFloat(changePercent.toFixed(4)),
            volume,
            marketCap: 0, // Not available from chart API
            dayHigh,
            dayLow,
            fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh || 0,
            fiftyTwoWeekLow: meta.fiftyTwoWeekLow || 0,
            avgVolume: 0,
            pe: null,
            eps: null,
            currency: meta.currency || "USD",
            exchange: meta.exchangeName || meta.fullExchangeName || "",
            sector: "",
            industry: "",
          };
        } catch (err) {
          console.error(`Failed to fetch quote for ${sym}:`, err);
          return null;
        }
      })
    );

    return NextResponse.json({ quotes: quotes.filter(Boolean) });
  } catch (error: any) {
    console.error("Yahoo Quote Proxy Error:", error);
    return NextResponse.json({ quotes: [], error: error.message }, { status: 500 });
  }
}
