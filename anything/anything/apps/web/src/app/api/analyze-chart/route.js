import sql from "@/app/api/utils/sql";

// AI analysis now happens on the frontend via GPT-4 Vision
// This route just saves the result to the database
export async function POST(request) {
  try {
    const { imageUrl, symbol, timeframe, userId, analysis } =
      await request.json();
    if (!analysis)
      return Response.json({ error: "No analysis provided" }, { status: 400 });

    const saved = await sql`
      INSERT INTO chart_analyses (user_id, symbol, timeframe, image_url, ai_response, bias, confidence)
      VALUES (${userId || "anonymous"}, ${symbol || null}, ${timeframe || null}, ${imageUrl || "local"}, ${JSON.stringify(analysis)}, ${analysis.bias || null}, ${analysis.confidence || null})
      RETURNING id, created_at
    `;
    return Response.json({ success: true, id: saved[0]?.id });
  } catch (error) {
    console.error("Save analysis error:", error);
    return Response.json({ error: "Failed to save analysis" }, { status: 500 });
  }
}
