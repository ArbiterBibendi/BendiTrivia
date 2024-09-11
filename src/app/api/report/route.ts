import { validateRequest } from "../../../utils/auth";
import { sql } from "@vercel/postgres";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

type reportRequest = {
  trivia_id: string;
  reason: string;
};
const REPORT_MAX_LENGTH = 256;
export async function POST(nextRequest: NextRequest) {
  const { user } = await validateRequest();
  if (!user) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }
  const request: reportRequest = await nextRequest.json();
  if (!request.trivia_id || !request.reason) {
    return NextResponse.json(
      { error: "id or reason not supplied" },
      { status: 400 }
    );
  }
  const trimmedReason = request.reason.substring(0, REPORT_MAX_LENGTH);
  const sqlResponse =
    await sql`INSERT INTO reports (trivia_id, info) VALUES (${request.trivia_id}, ${trimmedReason})`;
  return NextResponse.json({
    message: "Received",
  });
}
export async function GET(nextRequest: NextRequest) {
  return NextResponse.json([
    { id: "1", trivia_id: "1", info: "monday" },
    { id: "2", trivia_id: "2", info: "tuesday" },
    { id: "3", trivia_id: "3", info: "wednesday" },
    { id: "4", trivia_id: "4", info: "thursday" },
    { id: "5", trivia_id: "5", info: "friday" },
    { id: "6", trivia_id: "6", info: "saturday" },
    { id: "7", trivia_id: "7", info: "sunday" },
    { id: "8", trivia_id: "8", info: "monday" },
    { id: "9", trivia_id: "9", info: "tuesday" },
    { id: "0", trivia_id: "0", info: "wednesday" },
  ]);
}
