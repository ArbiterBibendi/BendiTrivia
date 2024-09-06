import { invalidateSessionAndSetBlankCookie } from "@/utils/auth";
import { NextRequest, NextResponse } from "next/server";

export function GET(request: NextRequest) {
  const response = NextResponse.json(
    { message: "Logged out" },
    { status: 200 }
  );
  return invalidateSessionAndSetBlankCookie(response);
}
