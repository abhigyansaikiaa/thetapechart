import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query || query.length < 1) {
    return NextResponse.json({ results: [] });
  }

  try {
    const url = `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=15&newsCount=0&listsCount=0&enableFuzzyQuery=false`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
    });

    if (!response.ok) {
      throw new Error(`Yahoo Search API responded with status: ${response.status}`);
    }

    const data = await response.json();

    const results = (data.quotes || []).map((q: any) => ({
      symbol: q.symbol,
      name: q.shortname || q.longname || q.symbol,
      type: q.quoteType?.toLowerCase() === "cryptocurrency" ? "crypto" :
            q.quoteType?.toLowerCase() === "equity" ? "stock" :
            q.quoteType?.toLowerCase() === "currency" ? "forex" :
            q.quoteType?.toLowerCase() === "future" ? "commodity" :
            q.quoteType?.toLowerCase() === "index" ? "index" : "stock",
      exchange: q.exchDisp || q.exchange || "",
    }));

    return NextResponse.json({ results });
  } catch (error: any) {
    console.error("Yahoo Search Proxy Error:", error);
    return NextResponse.json({ results: [], error: error.message }, { status: 500 });
  }
}
