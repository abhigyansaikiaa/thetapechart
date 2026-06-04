import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "demo-user";
    const status = searchParams.get("status");
    let rows;
    if (status) {
      rows =
        await sql`SELECT * FROM trades WHERE user_id = ${userId} AND status = ${status} ORDER BY entry_at DESC`;
    } else {
      rows =
        await sql`SELECT * FROM trades WHERE user_id = ${userId} ORDER BY entry_at DESC`;
    }
    return Response.json(rows);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch trades" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      user_id = "demo-user",
      symbol,
      instrument_type = "equity",
      direction,
      entry_price,
      exit_price,
      stop_loss,
      take_profit,
      quantity,
      lot_size = 1,
      strategy,
      setup_name,
      screenshot_url,
      notes,
      mood,
      confidence,
    } = body;

    let pnl = null;
    let rr_ratio = null;
    if (exit_price && entry_price && quantity) {
      pnl =
        direction === "long"
          ? (exit_price - entry_price) * quantity
          : (entry_price - exit_price) * quantity;
    }
    if (stop_loss && take_profit && entry_price) {
      const risk = Math.abs(entry_price - stop_loss);
      const reward = Math.abs(take_profit - entry_price);
      rr_ratio = risk > 0 ? parseFloat((reward / risk).toFixed(2)) : null;
    }

    const status = exit_price ? "closed" : "open";
    const rows = await sql`
      INSERT INTO trades (user_id, symbol, instrument_type, direction, entry_price, exit_price, stop_loss, take_profit, quantity, lot_size, strategy, setup_name, screenshot_url, notes, mood, confidence, pnl, rr_ratio, status, exit_at)
      VALUES (${user_id}, ${symbol}, ${instrument_type}, ${direction}, ${entry_price}, ${exit_price || null}, ${stop_loss || null}, ${take_profit || null}, ${quantity}, ${lot_size}, ${strategy || null}, ${setup_name || null}, ${screenshot_url || null}, ${notes || null}, ${mood || null}, ${confidence || null}, ${pnl}, ${rr_ratio}, ${status}, ${exit_price ? new Date().toISOString() : null})
      RETURNING *
    `;
    return Response.json(rows[0]);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to create trade" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, exit_price, notes, stop_loss, take_profit } = body;
    const existing = await sql`SELECT * FROM trades WHERE id = ${id}`;
    if (!existing.length)
      return Response.json({ error: "Trade not found" }, { status: 404 });
    const trade = existing[0];

    let pnl = trade.pnl;
    if (exit_price) {
      pnl =
        trade.direction === "long"
          ? (exit_price - trade.entry_price) * trade.quantity
          : (trade.entry_price - exit_price) * trade.quantity;
    }

    const rows = await sql`
      UPDATE trades SET
        exit_price = COALESCE(${exit_price || null}, exit_price),
        notes = COALESCE(${notes || null}, notes),
        stop_loss = COALESCE(${stop_loss || null}, stop_loss),
        take_profit = COALESCE(${take_profit || null}, take_profit),
        pnl = ${pnl},
        status = ${exit_price ? "closed" : trade.status},
        exit_at = ${exit_price ? new Date().toISOString() : null}
      WHERE id = ${id}
      RETURNING *
    `;
    return Response.json(rows[0]);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to update trade" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    await sql`DELETE FROM trades WHERE id = ${id}`;
    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to delete trade" }, { status: 500 });
  }
}
