import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "demo-user";
    const rows = await sql`
      SELECT id, user_id, symbol, timeframe, image_url, ai_response, bias, confidence, created_at
      FROM chart_analyses
      ORDER BY created_at DESC
      LIMIT 20
    `;
    return Response.json(rows);
  } catch (error) {
    console.error(error);
    return Response.json([], { status: 500 });
  }
}
