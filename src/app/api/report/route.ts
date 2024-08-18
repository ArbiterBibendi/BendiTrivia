import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function POST(nextRequest: NextRequest) {
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
