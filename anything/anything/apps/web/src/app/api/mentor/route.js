import sql from "@/app/api/utils/sql";

// AI mentor calls now happen from the frontend
// This route saves messages and retrieves history
export async function POST(request) {
  try {
    const { userId = "demo-user", message, reply } = await request.json();

    if (message) {
      await sql`INSERT INTO chat_messages (user_id, role, content) VALUES (${userId}, 'user', ${message})`;
    }
    if (reply) {
      await sql`INSERT INTO chat_messages (user_id, role, content) VALUES (${userId}, 'assistant', ${reply})`;
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Mentor save error:", error);
    return Response.json({ error: "Failed to save" }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "demo-user";
    const rows = await sql`
      SELECT id, role, content, created_at FROM chat_messages
      WHERE user_id = ${userId} ORDER BY created_at ASC LIMIT 100
    `;
    return Response.json(rows);
  } catch (error) {
    console.error(error);
    return Response.json([], { status: 500 });
  }
}
