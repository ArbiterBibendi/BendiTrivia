import { QueryResult, sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { category: string } }
) {
  const category: string | null = params.category ? params.category[0] : null;
  let trivia: QueryResult;
  if (category == null || category.toLowerCase() == "all") {
    trivia =
      await sql`SELECT question, answer, category FROM trivia OFFSET floor(random() * (SELECT COUNT(*) FROM trivia)) LIMIT 1;`;
  } else {
    trivia =
      await sql`SELECT question, answer, category FROM trivia WHERE category ILIKE ${category} OFFSET floor(random() * (SELECT COUNT(*) FROM trivia WHERE category ILIKE ${category})) LIMIT 1;`;
  }

  if (trivia.rows.length <= 0) {
    return NextResponse.json({
      message: "No question found with those parameters",
    });
  }
  return NextResponse.json({ message: trivia.rows[0] });
}
export const revalidate = 0;
