import { validateRequest } from "@/utils/auth";
import { sql } from "@vercel/postgres";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(nextRequest: NextRequest) {
  const { user } = await validateRequest();
  if (!user) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }
  const request = await nextRequest.json();
  console.log(request);
  if (request.trivia_id && request.reason) {
    const sqlResponse =
      await sql`INSERT INTO reports (trivia_id, info) VALUES (${request.trivia_id}, ${request.reason})`;
    console.log(sqlResponse);
  }
  return NextResponse.json({
    message: "Recieved",
  });
}
