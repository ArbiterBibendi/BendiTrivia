import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string }}) {
    const id = Number(params.id[0]);
    const trivia = await sql`SELECT question, answer, category FROM trivia WHERE id=${id};`;
    
    if (trivia.rows.length <= 0) {
        return NextResponse.json({"message": "No question found with that id"});
    }
    return NextResponse.json({"message": trivia.rows[0]});
}