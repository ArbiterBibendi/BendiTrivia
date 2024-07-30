import { QueryResult, sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { category: string } }
) {
  const searchParams = request.nextUrl.searchParams;
  const category: string | null = searchParams.get("category");
  const id: string | null = searchParams.get("id");
  
  let trivia: QueryResult;
  if (id != null) {
    trivia =
      await sql`SELECT id, question, answer, category FROM trivia WHERE id=${Number(id)}`;
  } else if (category == null || category.toLowerCase() == "all") {
    trivia =
      await sql`SELECT id, question, answer, category FROM trivia OFFSET floor(random() * (SELECT COUNT(*) FROM trivia)) LIMIT 1;`;
  } else {
    trivia =
      await sql`SELECT id, question, answer, category FROM trivia WHERE category ILIKE ${category} OFFSET floor(random() * (SELECT COUNT(*) FROM trivia WHERE category ILIKE ${category})) LIMIT 1;`;
  }

  if (trivia.rows.length <= 0) {
    return NextResponse.json({
      message: "No question found with those parameters",
    });
  }
  return NextResponse.json({ message: trivia.rows[0] });
}
export const revalidate = 0;
