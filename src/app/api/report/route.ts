import { validateRequest } from "@/utils/auth";
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
    message: "Recieved",
  });
}
