import { QueryResult, sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

const errorTrivia = {
  question: "No question found with those parameters",
  answer: "",
  id: "-1",
};
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const qCategory: string | undefined | null = searchParams
    .get("category")
    ?.toLowerCase();
  const requestedCategory = qCategory ? qCategory : "all";
  const qId: string | null = searchParams.get("id");

  // only use category if no id is specified
  let trivia: QueryResult;
  if (qId != null) {
    trivia =
      await sql`SELECT id, question, answer, category FROM trivia WHERE id=${Number(qId)}`;
  } else if (requestedCategory == "all") {
    trivia =
      await sql`SELECT id, question, answer, category FROM trivia OFFSET floor(random() * (SELECT COUNT(*) FROM trivia)) LIMIT 1;`;
  } else {
    trivia =
      await sql`SELECT id, question, answer, category FROM trivia WHERE category ILIKE ${requestedCategory} OFFSET floor(random() * (SELECT COUNT(*) FROM trivia WHERE category ILIKE ${requestedCategory})) LIMIT 1;`;
  }

  if (trivia.rows.length <= 0) {
    return NextResponse.json({
      message: { ...errorTrivia, requestedCategory },
    });
  }
  return NextResponse.json({
    message: { ...trivia.rows[0], requestedCategory },
  });
}
export const revalidate = 0;
