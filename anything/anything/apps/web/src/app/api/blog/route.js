import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const slug = searchParams.get("slug");

    if (slug) {
      const rows =
        await sql`SELECT * FROM blog_posts WHERE slug = ${slug} AND published = true`;
      return Response.json(rows[0] || null);
    }
    if (category && category !== "All") {
      const rows =
        await sql`SELECT id, slug, title, excerpt, category, featured_image, meta_title, reading_time, published_at FROM blog_posts WHERE published = true AND category = ${category} ORDER BY published_at DESC`;
      return Response.json(rows);
    }
    const rows =
      await sql`SELECT id, slug, title, excerpt, category, featured_image, meta_title, reading_time, published_at FROM blog_posts WHERE published = true ORDER BY published_at DESC`;
    return Response.json(rows);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}
