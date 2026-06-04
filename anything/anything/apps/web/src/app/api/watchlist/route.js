import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "demo-user";
    const rows =
      await sql`SELECT * FROM watchlists WHERE user_id = ${userId} ORDER BY created_at ASC`;
    if (rows.length === 0) {
      const created = await sql`
        INSERT INTO watchlists (user_id, name, symbols) VALUES (${userId}, 'My Watchlist', '[]'::jsonb) RETURNING *
      `;
      return Response.json(created);
    }
    return Response.json(rows);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to fetch watchlists" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const { userId = "demo-user", name = "New Watchlist" } =
      await request.json();
    const rows = await sql`
      INSERT INTO watchlists (user_id, name, symbols) VALUES (${userId}, ${name}, '[]'::jsonb) RETURNING *
    `;
    return Response.json(rows[0]);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to create watchlist" },
      { status: 500 },
    );
  }
}

export async function PUT(request) {
  try {
    const { id, symbols, name } = await request.json();
    let rows;
    if (symbols !== undefined) {
      rows =
        await sql`UPDATE watchlists SET symbols = ${JSON.stringify(symbols)}::jsonb, updated_at = NOW() WHERE id = ${id} RETURNING *`;
    } else if (name) {
      rows =
        await sql`UPDATE watchlists SET name = ${name}, updated_at = NOW() WHERE id = ${id} RETURNING *`;
    }
    return Response.json(rows?.[0]);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to update watchlist" },
      { status: 500 },
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    await sql`DELETE FROM watchlists WHERE id = ${id}`;
    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to delete watchlist" },
      { status: 500 },
    );
  }
}
