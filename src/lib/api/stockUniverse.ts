/**
 * AlphaEdge Stock Universe
 * Curated lists of popular stocks organized by market for the Terminal Explorer
 */

export interface StockEntry {
  symbol: string;
  name: string;
  type: "stock" | "crypto" | "forex" | "commodity" | "index";
  exchange?: string;
}

// ── NIFTY 50 (NSE India) ──────────────────────────────────────
export const NIFTY_50: StockEntry[] = [
  { symbol: "RELIANCE.NS", name: "Reliance Industries", type: "stock", exchange: "NSE" },
  { symbol: "TCS.NS", name: "Tata Consultancy Services", type: "stock", exchange: "NSE" },
  { symbol: "HDFCBANK.NS", name: "HDFC Bank", type: "stock", exchange: "NSE" },
  { symbol: "INFY.NS", name: "Infosys", type: "stock", exchange: "NSE" },
  { symbol: "ICICIBANK.NS", name: "ICICI Bank", type: "stock", exchange: "NSE" },
  { symbol: "HINDUNILVR.NS", name: "Hindustan Unilever", type: "stock", exchange: "NSE" },
  { symbol: "ITC.NS", name: "ITC Limited", type: "stock", exchange: "NSE" },
  { symbol: "SBIN.NS", name: "State Bank of India", type: "stock", exchange: "NSE" },
  { symbol: "BHARTIARTL.NS", name: "Bharti Airtel", type: "stock", exchange: "NSE" },
  { symbol: "KOTAKBANK.NS", name: "Kotak Mahindra Bank", type: "stock", exchange: "NSE" },
  { symbol: "LT.NS", name: "Larsen & Toubro", type: "stock", exchange: "NSE" },
  { symbol: "AXISBANK.NS", name: "Axis Bank", type: "stock", exchange: "NSE" },
  { symbol: "BAJFINANCE.NS", name: "Bajaj Finance", type: "stock", exchange: "NSE" },
  { symbol: "ASIANPAINT.NS", name: "Asian Paints", type: "stock", exchange: "NSE" },
  { symbol: "MARUTI.NS", name: "Maruti Suzuki", type: "stock", exchange: "NSE" },
  { symbol: "HCLTECH.NS", name: "HCL Technologies", type: "stock", exchange: "NSE" },
  { symbol: "TITAN.NS", name: "Titan Company", type: "stock", exchange: "NSE" },
  { symbol: "SUNPHARMA.NS", name: "Sun Pharma", type: "stock", exchange: "NSE" },
  { symbol: "TATAMOTORS.NS", name: "Tata Motors", type: "stock", exchange: "NSE" },
  { symbol: "WIPRO.NS", name: "Wipro", type: "stock", exchange: "NSE" },
  { symbol: "ULTRACEMCO.NS", name: "UltraTech Cement", type: "stock", exchange: "NSE" },
  { symbol: "NESTLEIND.NS", name: "Nestle India", type: "stock", exchange: "NSE" },
  { symbol: "POWERGRID.NS", name: "Power Grid Corp", type: "stock", exchange: "NSE" },
  { symbol: "NTPC.NS", name: "NTPC Limited", type: "stock", exchange: "NSE" },
  { symbol: "BAJAJFINSV.NS", name: "Bajaj Finserv", type: "stock", exchange: "NSE" },
  { symbol: "TECHM.NS", name: "Tech Mahindra", type: "stock", exchange: "NSE" },
  { symbol: "ONGC.NS", name: "ONGC", type: "stock", exchange: "NSE" },
  { symbol: "TATASTEEL.NS", name: "Tata Steel", type: "stock", exchange: "NSE" },
  { symbol: "ADANIENT.NS", name: "Adani Enterprises", type: "stock", exchange: "NSE" },
  { symbol: "COALINDIA.NS", name: "Coal India", type: "stock", exchange: "NSE" },
  { symbol: "JSWSTEEL.NS", name: "JSW Steel", type: "stock", exchange: "NSE" },
  { symbol: "ADANIPORTS.NS", name: "Adani Ports", type: "stock", exchange: "NSE" },
  { symbol: "M&M.NS", name: "Mahindra & Mahindra", type: "stock", exchange: "NSE" },
  { symbol: "DRREDDY.NS", name: "Dr. Reddy's Labs", type: "stock", exchange: "NSE" },
  { symbol: "CIPLA.NS", name: "Cipla", type: "stock", exchange: "NSE" },
  { symbol: "DIVISLAB.NS", name: "Divi's Labs", type: "stock", exchange: "NSE" },
  { symbol: "BRITANNIA.NS", name: "Britannia Industries", type: "stock", exchange: "NSE" },
  { symbol: "EICHERMOT.NS", name: "Eicher Motors", type: "stock", exchange: "NSE" },
  { symbol: "APOLLOHOSP.NS", name: "Apollo Hospitals", type: "stock", exchange: "NSE" },
  { symbol: "GRASIM.NS", name: "Grasim Industries", type: "stock", exchange: "NSE" },
  { symbol: "BPCL.NS", name: "BPCL", type: "stock", exchange: "NSE" },
  { symbol: "HEROMOTOCO.NS", name: "Hero MotoCorp", type: "stock", exchange: "NSE" },
  { symbol: "TATACONSUM.NS", name: "Tata Consumer Products", type: "stock", exchange: "NSE" },
  { symbol: "SBILIFE.NS", name: "SBI Life Insurance", type: "stock", exchange: "NSE" },
  { symbol: "HDFCLIFE.NS", name: "HDFC Life Insurance", type: "stock", exchange: "NSE" },
  { symbol: "INDUSINDBK.NS", name: "IndusInd Bank", type: "stock", exchange: "NSE" },
  { symbol: "HINDALCO.NS", name: "Hindalco Industries", type: "stock", exchange: "NSE" },
  { symbol: "BAJAJ-AUTO.NS", name: "Bajaj Auto", type: "stock", exchange: "NSE" },
  { symbol: "SHRIRAMFIN.NS", name: "Shriram Finance", type: "stock", exchange: "NSE" },
  { symbol: "BEL.NS", name: "Bharat Electronics", type: "stock", exchange: "NSE" },
];

// ── US STOCKS (S&P 500 Top) ────────────────────────────────────
export const SP500_TOP: StockEntry[] = [
  { symbol: "AAPL", name: "Apple Inc.", type: "stock", exchange: "NASDAQ" },
  { symbol: "MSFT", name: "Microsoft Corporation", type: "stock", exchange: "NASDAQ" },
  { symbol: "GOOGL", name: "Alphabet (Google)", type: "stock", exchange: "NASDAQ" },
  { symbol: "AMZN", name: "Amazon.com", type: "stock", exchange: "NASDAQ" },
  { symbol: "NVDA", name: "NVIDIA Corporation", type: "stock", exchange: "NASDAQ" },
  { symbol: "META", name: "Meta Platforms", type: "stock", exchange: "NASDAQ" },
  { symbol: "TSLA", name: "Tesla Inc.", type: "stock", exchange: "NASDAQ" },
  { symbol: "BRK-B", name: "Berkshire Hathaway B", type: "stock", exchange: "NYSE" },
  { symbol: "JPM", name: "JPMorgan Chase", type: "stock", exchange: "NYSE" },
  { symbol: "V", name: "Visa Inc.", type: "stock", exchange: "NYSE" },
  { symbol: "JNJ", name: "Johnson & Johnson", type: "stock", exchange: "NYSE" },
  { symbol: "WMT", name: "Walmart", type: "stock", exchange: "NYSE" },
  { symbol: "PG", name: "Procter & Gamble", type: "stock", exchange: "NYSE" },
  { symbol: "MA", name: "Mastercard", type: "stock", exchange: "NYSE" },
  { symbol: "HD", name: "Home Depot", type: "stock", exchange: "NYSE" },
  { symbol: "DIS", name: "Walt Disney", type: "stock", exchange: "NYSE" },
  { symbol: "BAC", name: "Bank of America", type: "stock", exchange: "NYSE" },
  { symbol: "NFLX", name: "Netflix", type: "stock", exchange: "NASDAQ" },
  { symbol: "CRM", name: "Salesforce", type: "stock", exchange: "NYSE" },
  { symbol: "AMD", name: "Advanced Micro Devices", type: "stock", exchange: "NASDAQ" },
  { symbol: "INTC", name: "Intel Corporation", type: "stock", exchange: "NASDAQ" },
  { symbol: "ADBE", name: "Adobe Inc.", type: "stock", exchange: "NASDAQ" },
  { symbol: "CSCO", name: "Cisco Systems", type: "stock", exchange: "NASDAQ" },
  { symbol: "PEP", name: "PepsiCo Inc.", type: "stock", exchange: "NASDAQ" },
  { symbol: "KO", name: "Coca-Cola", type: "stock", exchange: "NYSE" },
];

// ── CRYPTO ─────────────────────────────────────────────────────
export const CRYPTO_MAJOR: StockEntry[] = [
  { symbol: "BTCUSDT", name: "Bitcoin", type: "crypto" },
  { symbol: "ETHUSDT", name: "Ethereum", type: "crypto" },
  { symbol: "BNBUSDT", name: "Binance Coin", type: "crypto" },
  { symbol: "SOLUSDT", name: "Solana", type: "crypto" },
  { symbol: "XRPUSDT", name: "XRP (Ripple)", type: "crypto" },
  { symbol: "ADAUSDT", name: "Cardano", type: "crypto" },
  { symbol: "DOGEUSDT", name: "Dogecoin", type: "crypto" },
  { symbol: "AVAXUSDT", name: "Avalanche", type: "crypto" },
  { symbol: "DOTUSDT", name: "Polkadot", type: "crypto" },
  { symbol: "MATICUSDT", name: "Polygon (MATIC)", type: "crypto" },
  { symbol: "LINKUSDT", name: "Chainlink", type: "crypto" },
  { symbol: "ATOMUSDT", name: "Cosmos", type: "crypto" },
  { symbol: "LTCUSDT", name: "Litecoin", type: "crypto" },
  { symbol: "UNIUSDT", name: "Uniswap", type: "crypto" },
  { symbol: "NEARUSDT", name: "NEAR Protocol", type: "crypto" },
];

// ── FOREX ──────────────────────────────────────────────────────
export const FOREX_PAIRS: StockEntry[] = [
  { symbol: "EURUSD=X", name: "EUR/USD", type: "forex" },
  { symbol: "GBPUSD=X", name: "GBP/USD", type: "forex" },
  { symbol: "USDJPY=X", name: "USD/JPY", type: "forex" },
  { symbol: "USDCHF=X", name: "USD/CHF", type: "forex" },
  { symbol: "AUDUSD=X", name: "AUD/USD", type: "forex" },
  { symbol: "USDCAD=X", name: "USD/CAD", type: "forex" },
  { symbol: "NZDUSD=X", name: "NZD/USD", type: "forex" },
  { symbol: "USDINR=X", name: "USD/INR", type: "forex" },
  { symbol: "GBPJPY=X", name: "GBP/JPY", type: "forex" },
  { symbol: "EURJPY=X", name: "EUR/JPY", type: "forex" },
  { symbol: "EURGBP=X", name: "EUR/GBP", type: "forex" },
  { symbol: "AUDJPY=X", name: "AUD/JPY", type: "forex" },
];

// ── COMMODITIES ────────────────────────────────────────────────
export const COMMODITIES: StockEntry[] = [
  { symbol: "GC=F", name: "Gold Futures", type: "commodity" },
  { symbol: "SI=F", name: "Silver Futures", type: "commodity" },
  { symbol: "CL=F", name: "Crude Oil WTI", type: "commodity" },
  { symbol: "BZ=F", name: "Brent Crude Oil", type: "commodity" },
  { symbol: "NG=F", name: "Natural Gas", type: "commodity" },
  { symbol: "HG=F", name: "Copper Futures", type: "commodity" },
  { symbol: "PL=F", name: "Platinum Futures", type: "commodity" },
  { symbol: "ZW=F", name: "Wheat Futures", type: "commodity" },
];

// ── INDICES ────────────────────────────────────────────────────
export const GLOBAL_INDICES: StockEntry[] = [
  { symbol: "^NSEI", name: "NIFTY 50", type: "index" },
  { symbol: "^BSESN", name: "SENSEX", type: "index" },
  { symbol: "^GSPC", name: "S&P 500", type: "index" },
  { symbol: "^DJI", name: "Dow Jones", type: "index" },
  { symbol: "^IXIC", name: "NASDAQ Composite", type: "index" },
  { symbol: "^FTSE", name: "FTSE 100", type: "index" },
  { symbol: "^N225", name: "Nikkei 225", type: "index" },
  { symbol: "^HSI", name: "Hang Seng", type: "index" },
];

// ── Market Tab Configuration ──────────────────────────────────
export type MarketTab = "nse" | "us" | "crypto" | "forex" | "commodities" | "indices";

export const MARKET_TABS: { id: MarketTab; label: string; data: StockEntry[] }[] = [
  { id: "nse", label: "NSE (India)", data: NIFTY_50 },
  { id: "us", label: "US Stocks", data: SP500_TOP },
  { id: "crypto", label: "Crypto", data: CRYPTO_MAJOR },
  { id: "forex", label: "Forex", data: FOREX_PAIRS },
  { id: "commodities", label: "Commodities", data: COMMODITIES },
  { id: "indices", label: "Indices", data: GLOBAL_INDICES },
];

// ── Helper to get TradingView symbol format ───────────────────
export function getTradingViewSymbol(symbol: string, type: string): string {
  // TradingView uses a different symbol format
  if (type === "crypto") {
    // BTCUSDT -> BINANCE:BTCUSDT
    return `BINANCE:${symbol}`;
  }
  if (symbol.endsWith(".NS")) {
    // RELIANCE.NS -> NSE:RELIANCE
    return `NSE:${symbol.replace(".NS", "")}`;
  }
  if (symbol.endsWith(".BO")) {
    return `BSE:${symbol.replace(".BO", "")}`;
  }
  if (symbol.includes("=X")) {
    // EURUSD=X -> FX:EURUSD
    return `FX:${symbol.replace("=X", "")}`;
  }
  if (symbol.includes("=F")) {
    // GC=F -> COMEX:GC1!
    const base = symbol.replace("=F", "");
    const commodityMap: Record<string, string> = {
      "GC": "COMEX:GC1!", "SI": "COMEX:SI1!", "CL": "NYMEX:CL1!",
      "BZ": "NYMEX:BZ1!", "NG": "NYMEX:NG1!", "HG": "COMEX:HG1!",
      "PL": "NYMEX:PL1!", "ZW": "CBOT:ZW1!",
    };
    return commodityMap[base] || `NYMEX:${base}1!`;
  }
  if (symbol.startsWith("^")) {
    const indexMap: Record<string, string> = {
      "^NSEI": "NSE:NIFTY", "^BSESN": "BSE:SENSEX",
      "^GSPC": "SP:SPX", "^DJI": "DJ:DJI",
      "^IXIC": "NASDAQ:IXIC", "^FTSE": "LSE:UKX",
      "^N225": "TVC:NI225", "^HSI": "HSI:HSI",
    };
    return indexMap[symbol] || symbol;
  }
  // Default: assume NASDAQ/NYSE
  return symbol;
}

// ── Helper to get display name ────────────────────────────────
export function getDisplaySymbol(symbol: string): string {
  return symbol.replace(".NS", "").replace(".BO", "").replace("=X", "").replace("=F", "").replace("^", "");
}
