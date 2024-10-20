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
  const { user } = await validateRequest();
  if (!user || user.role != "admin") {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }
  const page = Number(nextRequest.nextUrl.searchParams.get("p")) || Number(0);
  const limit = Number(nextRequest.nextUrl.searchParams.get("limit")) || 10;
  const sqlResponse =
    await sql`SELECT reports.id, trivia_id, question, answer, category, info FROM reports LEFT JOIN trivia ON trivia.id = reports.trivia_id LIMIT ${limit} OFFSET ${page * limit}`;
  return NextResponse.json(sqlResponse.rows);
}

export async function DELETE(nextRequest: NextRequest) {
  const { user } = await validateRequest();
  if (!user || user.role != "admin") {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }
  try {
    const request = await nextRequest.json();
    if (!request) {
      return;
    }
    const reportId = Number(request);
    await sql`DELETE FROM reports WHERE id=${reportId}`;
    return NextResponse.json({ message: "ok" });
  } catch {
    return NextResponse.json(
      { error: "could not update database" },
      { status: 500 }
    );
  }
}
