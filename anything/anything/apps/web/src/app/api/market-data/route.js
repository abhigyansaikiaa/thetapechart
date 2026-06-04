// Real-time market data proxy from Yahoo Finance
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get("symbol") || "^NSEI";
    const range = searchParams.get("range") || "1d";
    const interval = searchParams.get("interval") || "5m";

    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=${interval}&range=${range}&includePrePost=false`;

    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "application/json",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://finance.yahoo.com/",
      },
    });

    if (!res.ok) {
      return Response.json(
        { error: `Yahoo Finance error: ${res.status}` },
        { status: res.status },
      );
    }

    const data = await res.json();
    const result = data?.chart?.result?.[0];

    if (!result) {
      return Response.json({ error: "No data found" }, { status: 404 });
    }

    const meta = result.meta;
    const timestamps = result.timestamp || [];
    const quotes = result.indicators?.quote?.[0] || {};

    const candles = timestamps
      .map((t, i) => ({
        time: t,
        open: quotes.open?.[i],
        high: quotes.high?.[i],
        low: quotes.low?.[i],
        close: quotes.close?.[i],
        volume: quotes.volume?.[i],
      }))
      .filter((c) => c.close !== null && c.close !== undefined);

    return Response.json({
      symbol: meta.symbol,
      currency: meta.currency,
      regularMarketPrice: meta.regularMarketPrice,
      previousClose: meta.chartPreviousClose || meta.previousClose,
      change:
        meta.regularMarketPrice -
        (meta.chartPreviousClose || meta.previousClose),
      changePercent:
        ((meta.regularMarketPrice -
          (meta.chartPreviousClose || meta.previousClose)) /
          (meta.chartPreviousClose || meta.previousClose)) *
        100,
      dayHigh: meta.regularMarketDayHigh,
      dayLow: meta.regularMarketDayLow,
      volume: meta.regularMarketVolume,
      marketCap: meta.marketCap,
      fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh,
      fiftyTwoWeekLow: meta.fiftyTwoWeekLow,
      candles,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Market data error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// Batch multiple symbols
export async function POST(request) {
  try {
    const { symbols = [] } = await request.json();
    if (!symbols.length) return Response.json([]);

    const results = await Promise.allSettled(
      symbols.map(async (sym) => {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?interval=1d&range=1d`;
        const res = await fetch(url, {
          headers: {
            "User-Agent": "Mozilla/5.0",
            Accept: "application/json",
            Referer: "https://finance.yahoo.com/",
          },
        });
        if (!res.ok) return null;
        const data = await res.json();
        const meta = data?.chart?.result?.[0]?.meta;
        if (!meta) return null;
        const prevClose =
          meta.chartPreviousClose ||
          meta.previousClose ||
          meta.regularMarketPrice;
        return {
          symbol: sym,
          price: meta.regularMarketPrice,
          change: meta.regularMarketPrice - prevClose,
          changePercent:
            ((meta.regularMarketPrice - prevClose) / prevClose) * 100,
          volume: meta.regularMarketVolume,
          dayHigh: meta.regularMarketDayHigh,
          dayLow: meta.regularMarketDayLow,
        };
      }),
    );

    const data = results
      .filter((r) => r.status === "fulfilled" && r.value)
      .map((r) => r.value);

    return Response.json(data);
  } catch (error) {
    console.error("Batch market data error:", error);
    return Response.json([], { status: 500 });
  }
}
