import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";
export async function GET(nextRequest: NextRequest) {
	try {
		await sql`SELECT 1`;
		return NextResponse.json({}, { status: 200});
	} catch(e) {
		return NextResponse.json({error: "There was an issue connecting to the database"}, { status: 500});
	}
}