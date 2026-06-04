import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance();

async function test() {
  try {
    const finnhubKey = "d8gtjv1r01qhjpmpl080d8gtjv1r01qhjpmpl08g";
    const symbols = ["AAPL", "^NSEI", "BINANCE:BTCUSDT", "OANDA:EUR_USD", "TSLA", "RELIANCE.NS"];
    const yahooSymbols = [];
    const finnhubSymbols = [];

    for (const sym of symbols) {
      if (sym.endsWith('.NS') || sym.endsWith('.BO') || sym.startsWith('^')) {
        yahooSymbols.push(sym);
      } else {
        finnhubSymbols.push(sym);
      }
    }

    console.log("Yahoo:", yahooSymbols);
    console.log("Finnhub:", finnhubSymbols);

    const results = [];

    if (yahooSymbols.length > 0) {
      const yfResults = await yahooFinance.quote(yahooSymbols);
      const quotes = Array.isArray(yfResults) ? yfResults : [yfResults];
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
    }

    if (finnhubSymbols.length > 0) {
      const fetchPromises = finnhubSymbols.map(async (sym) => {
        try {
          const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${sym}&token=${finnhubKey}`);
          if (res.ok) {
            const data = await res.json();
            if (data.c !== undefined && data.c !== 0) {
              return {
                symbol: sym,
                name: sym,
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

    console.log("Results:");
    console.dir(results, { depth: null });
  } catch (err) {
    console.error("Test Error:", err);
  }
}

test();
