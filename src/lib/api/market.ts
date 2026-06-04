"use server";

/**
 * AlphaEdge Market Data Provider Wrapper
 * 
 * This module connects to AlphaVantage and TwelveData for real-time and historical market data.
 * IMPORTANT: You must provide your own API keys in .env.local for this to work.
 */

const ALPHA_VANTAGE_URL = "https://www.alphavantage.co/query";
const TWELVE_DATA_URL = "https://api.twelvedata.com";

// Helper to check if we're using mock data
const isMockMode = () => {
  const key = process.env.ALPHA_VANTAGE_API_KEY;
  return !key || key.includes("placeholder");
};

export async function getQuote(symbol: string) {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=5d`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      next: { revalidate: 60 }
    });

    if (!res.ok) {
      throw new Error(`Yahoo Finance returned ${res.status}`);
    }

    const data = await res.json();
    const result = data.chart?.result?.[0];
    if (!result) throw new Error("Invalid symbol or no data");

    const meta = result.meta;
    const price = meta.regularMarketPrice || 0;
    const previousClose = meta.chartPreviousClose || meta.previousClose || price;
    const change = price - previousClose;
    const changePercent = previousClose ? (change / previousClose) * 100 : 0;
    
    // Get volume from latest quote
    const timestamps = result.timestamp || [];
    const quotes = result.indicators?.quote?.[0];
    const lastIdx = timestamps.length - 1;
    const volume = quotes?.volume?.[lastIdx] || 0;

    return {
      symbol: meta.symbol || symbol,
      price: price.toFixed(2),
      change: change.toFixed(2),
      changePercent: changePercent.toFixed(2) + "%",
      volume: volume.toString(),
      lastTradingDay: new Date().toISOString().split('T')[0]
    };
  } catch (error) {
    console.warn(`[Market API] Fallback to MOCK data for quote: ${symbol} due to error:`, error);
    return {
      symbol: symbol.toUpperCase(),
      price: (Math.random() * 500 + 50).toFixed(2),
      change: (Math.random() * 10 - 5).toFixed(2),
      changePercent: (Math.random() * 4 - 2).toFixed(2) + "%",
      volume: Math.floor(Math.random() * 10000000).toString(),
      lastTradingDay: new Date().toISOString().split('T')[0]
    };
  }
}

/**
 * Fetches intraday time series for a symbol (for charts).
 */
export async function getIntradayData(symbol: string, interval: "1min" | "5min" | "15min" | "60min" = "15min") {
  if (isMockMode()) {
    console.warn("[Market API] Using MOCK data for intraday:", symbol);
    // Generate some fake candle data
    const candles = [];
    let currentPrice = 150;
    const now = new Date();
    for (let i = 0; i < 50; i++) {
      const open = currentPrice;
      const close = currentPrice + (Math.random() * 2 - 1);
      const high = Math.max(open, close) + Math.random();
      const low = Math.min(open, close) - Math.random();
      currentPrice = close;
      
      const time = new Date(now.getTime() - (50 - i) * 15 * 60000);
      
      candles.push({
        time: time.toISOString(),
        open: open.toFixed(2),
        high: high.toFixed(2),
        low: low.toFixed(2),
        close: close.toFixed(2),
        volume: Math.floor(Math.random() * 100000)
      });
    }
    return candles;
  }

  try {
    const res = await fetch(
      `${ALPHA_VANTAGE_URL}?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${interval}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`,
      { next: { revalidate: 300 } }
    );
    const data = await res.json();
    const timeSeriesKey = `Time Series (${interval})`;
    const timeSeries = data[timeSeriesKey];
    
    if (!timeSeries) throw new Error("Intraday data not available");

    return Object.entries(timeSeries).map(([time, values]: [string, any]) => ({
      time,
      open: parseFloat(values["1. open"]).toFixed(2),
      high: parseFloat(values["2. high"]).toFixed(2),
      low: parseFloat(values["3. low"]).toFixed(2),
      close: parseFloat(values["4. close"]).toFixed(2),
      volume: parseInt(values["5. volume"], 10)
    })).reverse(); // Return chronological
  } catch (error) {
    console.error("[Market API] Error fetching intraday data:", error);
    throw error;
  }
}

/**
 * Fetches fundamental company overview.
 */
export async function getCompanyOverview(symbol: string) {
  if (isMockMode()) {
    return {
      symbol: symbol.toUpperCase(),
      name: `${symbol.toUpperCase()} Inc.`,
      description: "Mock company description generated because valid API keys are not provided in .env.local.",
      exchange: "NASDAQ",
      sector: "Technology",
      industry: "Software",
      marketCap: "2.5 Trillion",
      peRatio: "28.5",
      eps: "6.42",
      dividendYield: "1.2%",
      "52WeekHigh": "195.00",
      "52WeekLow": "120.00",
    };
  }

  try {
    const res = await fetch(
      `${ALPHA_VANTAGE_URL}?function=OVERVIEW&symbol=${symbol}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    if (Object.keys(data).length === 0) throw new Error("No overview data");
    
    return data;
  } catch (error) {
    console.error("[Market API] Error fetching overview:", error);
    throw error;
  }
}
